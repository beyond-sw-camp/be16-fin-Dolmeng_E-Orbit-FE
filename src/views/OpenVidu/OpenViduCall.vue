<template>
  <v-container fluid class="openvidu-container">

    <!-- 메인 비디오 영역 (컨트롤바를 포함하는 부모 영역) -->
    <v-row v-if="mainStreamManager" class="main-video-row no-gutters">
      <v-col cols="12" md="12" class="main-video-area pa-0">
        <div id="main-video-container" @click="updateMainStreamManager(mainStreamManager)">
          <video-stream :stream-manager="mainStreamManager" />
          <div class="nickname">
            {{ clientData(mainStreamManager) }}
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 컨트롤바 영역 -->
    <div class="control-bar-overlay">
      <div class="control-bar">
        <div class="controls-wrapper">

          <!-- (왼쪽 그룹) 토글 버튼들 -->
          <div class="left-controls d-flex justify-center align-center">
            <v-btn fab rounded="circle" width="60" height="60" :color="isRecordEnabled ? 'red' : 'black'" class="mx-1"
              @click="toggleRecord">
              <img :src="isRecordEnabled ? recordEnd : recordStart"
                style="width:30px;height:30px;filter:invert(100%);" />
            </v-btn>

            <v-btn fab rounded="circle" width="60" height="60" :color="isAudioEnabled ? 'black' : 'red'" class="mx-1"
              @click="toggleAudio">
              <img :src="isAudioEnabled ? audioIconOn : audioIconOff"
                style="width:30px;height:30px;filter:invert(100%);" />
            </v-btn>

            <v-btn fab rounded="circle" width="60" height="60" :color="isVideoEnabled ? 'green' : 'red'" class="mx-1"
              @click="toggleVideo">
              <img :src="isVideoEnabled ? videoIconOn : videoIconOff"
                style="width:30px;height:30px;filter:invert(100%);" />
            </v-btn>

            <v-btn fab rounded="circle" width="60" height="60"
              :color="isScreenShareEnabled ? 'green darken-2' : 'black'" class="mx-1" @click="toggleScreenShare">
              <img :src="isScreenShareIconOn ? screenShareIconOn : screenShareIconOff"
                style="width:30px;height:30px;filter:invert(100%);" />
            </v-btn>

            <v-btn fab rounded="circle" width="60" height="60" color="red darken-1" class="mx-1" @click="leaveSession">
              <img :src="shutdownIcon" style="width:30px;height:30px;filter:invert(100%);" />
            </v-btn>
          </div>

          <!-- (오른쪽 그룹) 전체화면 버튼 -->
          <div class="right-controls d-flex justify-end align-center">
            <v-btn fab width="60" height="60" color="transparent" class="mx-1" @click="toggleFullScreen" plain
              elevation="0">
                <img
    :src="isFullScreenMode ? fullScreenIconOut : fullScreenIconIn"
    style="width:24px;height:24px;"
    :style="{ filter: isFullScreenMode ? 'invert(100%)' : 'invert(0%)' }"
  />
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- 썸네일 비디오 영역 -->
    <v-row justify="start" class="remote-videos">
      <v-col cols="12" :md="4" v-if="publisher && mainStreamManager !== publisher" class="publisher-video-area">
        <div class="video-item" @click="updateMainStreamManager(publisher)">
          <video-stream :stream-manager="publisher" />
          <div class="nickname">
            나 ({{ clientData(publisher) }})
          </div>
        </div>
      </v-col>

      <v-col cols="12" :md="4" v-for="sub in filteredSubscribers" :key="sub.stream.connection.connectionId"
        class="subscriber-video-area">
        <div class="video-item" :id="'stream-' + sub.stream.streamId" @click="updateMainStreamManager(sub)">
          <video-stream :stream-manager="sub" />
          <div class="nickname">
            {{ clientData(sub) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import VideoStream from '../OpenVidu/VideoStream.vue';

// 아이콘 import
import recordFill from '@/assets/icons/OpenVidu/record-fill.svg';
import recordStop from '@/assets/icons/OpenVidu/record-stop.svg';
import micFill from '@/assets/icons/OpenVidu/mic-fill.svg';
import micOffFill from '@/assets/icons/OpenVidu/mic-off-fill.svg';
import vidOnFill from '@/assets/icons/OpenVidu/video-on-fill.svg';
import vidOffFill from '@/assets/icons/OpenVidu/video-off-fill.svg';
import shareScreenOff from '@/assets/icons/OpenVidu/share-box-fill.svg';
import shareScreenOn from '@/assets/icons/OpenVidu/share-box-off.svg';
import shutDownLine from '@/assets/icons/OpenVidu/shut-down-line.svg';
import fullScreeenIn from '@/assets/icons/OpenVidu/fullscreen-line.svg';
import fullScreeenOut from '@/assets/icons/OpenVidu/fullscreen-exit-line.svg';


export default {
  components: { VideoStream },
  data() {
    return {
      OV: null,
      session: undefined,
      publisher: undefined,
      subscribers: [],
      mainStreamManager: null,
      mySessionId: null,
      myUserName: localStorage.getItem("email"),

      isRecording: false, // 녹음 토글 상태
      recordingId: null,
      isAudioEnabled: true, // 오디오 토글 상태
      isVideoEnabled: true, // 비디오 토글 상태
      isScreenShareEnabled: false, // 화면 공유 상태

      devices: [], // 장치 목록
      audioInput: null, // 선택된 오디오 입력 장치 ID
      videoInput: null, // 선택된 비디오 입력 장치 ID
      audioOutput: null, // 출력 장치 (OpenVidu 직접 제어 불가, Vuetify 바인딩용)

      inputVolume: 70, // 입력 음량 (0-100)
      outputVolume: 70, // 출력 음량 (0-100)

      isFullScreenMode: false,

      // 아이콘 설정
      recordStart: recordFill, // 녹화 시작 아이콘
      recordEnd: recordStop, // 녹화 종료 아이콘

      audioIconOn: micFill, // 마이크 켜짐 아이콘
      audioIconOff: micOffFill, // 마이크 꺼짐 아이콘

      videoIconOn: vidOnFill, // 비디오 켜짐 아이콘
      videoIconOff: vidOffFill, // 비디오 꺼짐 아이콘

      screenShareIconOff: shareScreenOff, // 화면 공유 켜기 아이콘
      screenShareIconOn: shareScreenOn, // 화면 공유 끄기 아이콘

      fullScreenIconIn: fullScreeenIn, // 전체화면 진입 아이콘
      fullScreenIconOut: fullScreeenOut, // 전체화면 종료 아이콘

      shutdownIcon: shutDownLine, // 종료 아이콘
    }
  },
  async created() {
    const roomId = this.$route.params.roomId;
    if (!roomId) {
      alert("유효하지 않은 접근입니다. 채팅방 ID를 확인해 주세요.");
      this.$router.push('/');
      return;
    }
    this.mySessionId = roomId;
    await this.joinSession();
    // OV 객체가 생성된 후 장치 목록을 가져옵니다.
    if (this.OV) await this.getDevices();
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
    this.leaveSession();
  },

  mounted() {
    // 브라우저의 전체 화면 상태 변화 감지 이벤트 리스너 추가
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);
  },

  computed: {
    filteredSubscribers() {
      const publisherConnectionId = this.publisher?.stream?.connection?.connectionId;
      const seenClientData = new Set(); // 렌더링된 사용자 추적

      return this.subscribers.filter(sub => {
        const data = this.clientData(sub);

        // (1) 로컬 스트림 제외
        const isLocalStream = publisherConnectionId && sub.stream.connection.connectionId === publisherConnectionId;
        if (isLocalStream) return false;

        // (2) 🚨 핵심: 이미 같은 사용자의 스트림이 발견되었으면 무시 (중복 제거)
        if (seenClientData.has(data)) {
          return false;
        }
        seenClientData.add(data); // 처음 발견된 스트림만 Set에 추가하여 다음 필터링에 사용

        // (3) 메인 화면 영상 제외 및 Publisher 객체 자체 제외 (기존 로직 유지)
        const isMain = sub === this.mainStreamManager;
        const isMyPublisher = sub === this.publisher;

        return !isMain && !isMyPublisher;
      });
    },
  },

  methods: {
    async joinSession() {
      try {
        // 이미 세션이 존재하면 중복 실행 방지
        if (this.session && this.session.connected) {
          console.warn('Session already connected — skipping joinSession()');
          return;
        }

        // OpenVidu 인스턴스 초기화
        this.OV = new OpenVidu('http://localhost:4443');
        this.session = this.OV.initSession();

        // === 이벤트 등록 ===
        this.session.on('streamCreated', ({ stream }) => {
          // 내 자신의 스트림은 무시
          if (
            this.session?.connection &&
            stream.connection.connectionId === this.session.connection.connectionId
          ) return;

          // 중복 구독 방지
          const alreadySubscribed = this.subscribers.some(
            (s) => s.stream.connection.connectionId === stream.connection.connectionId
          );
          if (alreadySubscribed) return;

          const subscriber = this.session.subscribe(stream);
          this.subscribers.push(subscriber);

          // 렌더링 완료 후 볼륨 반영
          this.$nextTick(() => {
            this.updateOutputVolume(this.outputVolume);
          });
        });

        this.session.on('streamDestroyed', ({ stream }) => {
          if (this.mainStreamManager === stream.streamManager)
            this.mainStreamManager = this.publisher;

          this.deleteSubscriber(stream.streamManager);
        });

        this.session.on('connectionDestroyed', ({ connection }) => {
          const streamManager = this.subscribers.find(
            (sub) => sub.stream.connection.connectionId === connection.connectionId
          );

          if (streamManager) {
            this.deleteSubscriber(streamManager);
            if (this.mainStreamManager === streamManager)
              this.mainStreamManager = this.publisher;
          }
        });

        // === 세션 연결 ===
        const token = await this.getToken(); // 서버에서 토큰 발급받는 함수
        await this.session.connect(token, { clientData: this.myUserName });

        // === 퍼블리셔 초기화 및 publish ===
        this.publisher = await this.OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          mirror: false,
        });

        await this.session.publish(this.publisher);
        this.mainStreamManager = this.publisher;

        // === 새로고침 / 탭 닫기 시 안전하게 세션 정리 ===
        window.addEventListener('beforeunload', () => {
          if (this.session) this.session.disconnect();
        });

        console.log('✅ Session joined successfully.');
      } catch (error) {
        console.error('❌ Error joining session:', error);
        alert('세션에 연결 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
      }
    },

    // 🔴 [추가] 녹화 토글 함수
    async toggleRecord() {
      if (!this.session) {
        alert('세션에 연결되어 있지 않아 녹화 기능을 사용할 수 없습니다.');
        return;
      }

      if (this.isRecording) {
        // 녹화 중이면 중지
        await this.stopRecording();
      } else {
        // 녹화 중이 아니면 시작
        await this.startRecording();
      }
    },

    // 🔴 [추가] 녹화 시작 함수
    async startRecording() {
      try {
        // OpenVidu 서버의 녹화 시작 API 엔드포인트 호출
        // (주의: OpenVidu 서버/백엔드에 이 API를 구현해야 합니다.)
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/openvidu/recordings/start`,
          { sessionId: this.mySessionId },
          // 백엔드가 OpenVidu 서버와 통신할 수 있도록 필요한 헤더(예: 인증)를 추가할 수 있습니다.
          // 여기서는 백엔드가 OpenVidu API를 대신 호출한다고 가정합니다.
        );

        if (response.data && response.data.id) {
          this.recordingId = response.data.id;
          this.isRecording = true;
          console.log(`✅ Recording started successfully. Recording ID: ${this.recordingId}`);
        } else {
          throw new Error('녹화 시작 응답 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('❌ Error starting recording:', error);
        alert('녹화 시작에 실패했습니다. 백엔드 API 및 OpenVidu 서버 상태를 확인해주세요.');
      }
    },

    // 🔴 [추가] 녹화 중지 함수
    async stopRecording() {
      if (!this.recordingId) {
        console.warn('Recording ID is missing. Cannot stop recording.');
        return;
      }

      try {
        // OpenVidu 서버의 녹화 중지 API 엔드포인트 호출
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/openvidu/recordings/stop/${this.recordingId}`
        );

        if (response.status === 200 || response.status === 202) {
          this.isRecording = false;
          this.recordingId = null;
          console.log(`✅ Recording stopped successfully. Recording ID: ${this.recordingId}`);
          alert(`녹화가 성공적으로 중지되었습니다. 파일 처리에는 시간이 걸릴 수 있습니다.`);
        } else {
          throw new Error(`녹화 중지 응답 코드: ${response.status}`);
        }
      } catch (error) {
        console.error('❌ Error stopping recording:', error);
        alert('녹화 중지에 실패했습니다. 서버 상태를 확인해주세요.');
      }
    },

    async getToken() {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat-service/open-vidu/room/${this.mySessionId}/openvidu/token`);
        return res.data;
      } catch (err) {
        console.error('토큰 발급 실패:', err);
        throw err;
      }
    },
    leaveSession() {
      if (this.session) this.session.disconnect();
      this.session = undefined;
      this.subscribers = [];
      this.publisher = undefined;
      this.mainStreamManager = undefined;
      this.OV = null;
      this.$router.push(`/chatpage/${this.mySessionId}`);
    },
    deleteSubscriber(streamManager) {
      const idx = this.subscribers.indexOf(streamManager);
      if (idx > -1) this.subscribers.splice(idx, 1);
    },


    // 1. 메인 스트림 토글 로직
    updateMainStreamManager(streamManager) {
      // 현재 메인 영상과 클릭된 영상이 같으면, 메인 영상을 나의 영상(publisher)으로 돌립니다.
      if (this.mainStreamManager === streamManager) {
        this.mainStreamManager = this.publisher;
      } else {
        // 다르면 클릭된 영상을 메인으로 설정합니다.
        this.mainStreamManager = streamManager;
      }
    },

    // 2. 오디오 토글 기능
    toggleAudio() {
      if (this.publisher) {
        this.isAudioEnabled = !this.isAudioEnabled;
        this.publisher.publishAudio(this.isAudioEnabled);
      }
    },

    // 3. 비디오 토글 기능
    toggleVideo() {
      if (this.publisher) {
        this.isVideoEnabled = !this.isVideoEnabled;
        this.publisher.publishVideo(this.isVideoEnabled);
      }
    },

    clientData(streamManager) {
      if (streamManager?.stream?.connection?.data) {
        return JSON.parse(streamManager.stream.connection.data).clientData;
      }
      return 'Unknown';
    },

    // 4. 장치 목록 가져오기 및 초기화
    async getDevices() {
      try {
        this.devices = await this.OV.getDevices();
        const audioInputs = this.devices.filter(d => d.kind === 'audioinput');
        const videoInputs = this.devices.filter(d => d.kind === 'videoinput');

        // 초기 선택 (현재 활성화된 장치로 설정)
        this.audioInput = this.publisher?.properties?.audioSource || audioInputs[0]?.deviceId;
        this.videoInput = this.publisher?.properties?.videoSource || videoInputs[0]?.deviceId;

      } catch (error) {
        console.error('장치 목록 가져오기 오류:', error);
      }
    },

    // 5. 장치 변경 및 재게시 (Re-publishing)
    async changeDevice(deviceType, deviceId) {
      if (!this.publisher || !deviceId) return;

      const currentPublisher = this.publisher;
      const oldAudioEnabled = this.isAudioEnabled;
      const oldVideoEnabled = this.isVideoEnabled;

      // OpenVidu 객체에서 새 Publisher 생성 시에 사용할 설정
      const properties = {
        audioSource: deviceType === 'audio' ? deviceId : currentPublisher.properties.audioSource,
        videoSource: deviceType === 'video' ? deviceId : currentPublisher.properties.videoSource,
        publishAudio: oldAudioEnabled,
        publishVideo: oldVideoEnabled,
        // 기타 설정 (해상도 등)은 기존 설정 유지
        resolution: currentPublisher.properties.resolution,
        frameRate: currentPublisher.properties.frameRate,
        mirror: currentPublisher.properties.mirror,
      };

      try {
        // 기존 Publisher 연결 해제
        this.session.unpublish(currentPublisher);

        // 새 Publisher 생성
        const newPublisher = this.OV.initPublisher(undefined, properties);

        // 메인 스트림 업데이트 및 재게시
        this.publisher = newPublisher;
        this.mainStreamManager = newPublisher;
        await this.session.publish(newPublisher);

        // 장치 ID 상태 업데이트
        if (deviceType === 'audio') this.audioInput = deviceId;
        if (deviceType === 'video') this.videoInput = deviceId;

        console.log(`${deviceType} 장치 변경 성공:`, deviceId);


      } catch (error) {
        console.error('장치 변경 오류:', error);
      }
    },

    // 6. 화면 공유 토글
    async toggleScreenShare() {
      if (this.isScreenShareEnabled) {
        // 화면 공유 중지: 원래 카메라로 되돌림
        await this.stopScreenShare();
      } else {
        // 화면 공유 시작
        try {
          const screenPublisher = await this.OV.initPublisherAsync(undefined, {
            videoSource: 'screen', // 'screen'을 사용하여 화면 공유 스트림 생성
            publishAudio: this.isAudioEnabled, // 마이크 오디오는 유지
            publishVideo: true, // 비디오는 화면 공유 스트림으로 대체
            mirror: false,
          });

          // OpenVidu 세션에서 기존 Publisher 연결 해제
          this.session.unpublish(this.publisher);

          // 새로운 화면 공유 Publisher로 교체 및 게시
          this.publisher = screenPublisher;
          this.mainStreamManager = screenPublisher;
          await this.session.publish(screenPublisher);

          this.isScreenShareEnabled = true;
          this.isVideoEnabled = true; // 화면 공유는 비디오가 켜진 상태로 간주

          // 화면 공유가 멈췄을 때의 이벤트 처리
          screenPublisher.on('streamDestroyed', event => {
            if (event.reason === 'screenStoppedByMediaApi') {
              console.log('사용자가 직접 화면 공유를 중지했습니다.');
              this.stopScreenShare(true); // 재귀 호출 방지용 플래그
            }
          });

        } catch (error) {
          console.error('화면 공유 시작 오류:', error);
          this.isScreenShareEnabled = false;
        }
      }
    },

    async stopScreenShare(internalStop = false) {
      if (!this.isScreenShareEnabled && !internalStop) return;

      // 기존 화면 공유 Publisher 연결 해제
      this.session.unpublish(this.publisher);

      // 카메라 Publisher로 복귀
      const cameraPublisher = await this.OV.initPublisherAsync(undefined, {
        audioSource: this.audioInput,
        videoSource: this.videoInput,
        publishAudio: this.isAudioEnabled,
        publishVideo: this.isVideoEnabled,
        resolution: '640x480',
        frameRate: 30,
        mirror: true,
      });

      this.publisher = cameraPublisher;
      this.mainStreamManager = cameraPublisher;
      await this.session.publish(cameraPublisher);

      this.isScreenShareEnabled = false;
    },

    // 7. 전체화면 토글
    toggleFullScreen() {
      const element = this.$el;  // Vue 컴포넌트의 루트 엘리먼트
      if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { /* Firefox */
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE/Edge */
          element.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen();
        }
      }
    },

    // 전체 화면 상태 변경 핸들러
    handleFullscreenChange() {
      // document.fullscreenElement가 null이 아니면 전체 화면 상태임
      this.isFullScreenMode = !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement;
    },

    // 8. 출력 음량 조절 (Subscriber 볼륨 제어)
    updateOutputVolume(volume) {
      // this.outputVolume이 v-model로 바인딩되므로, volume은 슬라이더의 새 값입니다.
      this.outputVolume = volume;

      // 모든 원격 참가자의 볼륨을 조절합니다.
      this.subscribers.forEach(sub => {
        // OpenVidu StreamManager의 property로 볼륨을 설정합니다.
        // 'volume'은 0에서 100 사이의 값으로 설정
        if (sub.videos && sub.videos.length > 0) {
          // StreamManager의 set
          sub.videos[0].video.volume = volume / 100;
        }
      });

      // 메인 스트림이 원격일 경우에도 적용 (추가적인 안전 장치)
      if (this.mainStreamManager !== this.publisher &&
        this.mainStreamManager?.videos &&
        this.mainStreamManager.videos.length > 0) {
        this.mainStreamManager.videos[0].video.volume = volume / 100;
      }
    },
  },
};
</script>

<style scoped>
/* 일반 상태의 VUE.js 상위 컨테이너 초기화 및 마진 정렬 */
html,
body,
#app,
.v-application {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.video-item ::v-deep video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: black;
}

.v-row {
  margin: 0;
  width: 100%;
  padding: 0;
}

/* 1. 컨테이너 전체 레이아웃 스타일 */
.openvidu-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  padding: 0;
  margin: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

/* 2. 메인 비디오 영역 및 화면 공유 스타일 */
.main-video-row {
  flex-grow: 1;
  height: 90%;
  max-height: 100%;
}

.main-video-area {
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  height: 100%;
  max-width: 100%;
}

#main-video-container {
  /* (<-- 수정) 중앙 정렬을 위해 필요한 속성만 남기고 width/height는 제거 */
  position: relative;
  background-color: transparent;
  width: 90%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  margin: auto;
  /* ❗이 요소가 닉네임의 position: absolute 기준점 역할을 합니다. */
}

/* OpenVidu <video-stream> 내부의 <video> 요소를 위한 스타일 */
/* (생략) */
#main-video-container ::v-deep video {
  /* (<-- 수정) 비디오 스타일 유지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: transparent;
}

/* 3. 썸네일 비디오 영역 스타일 */
.remote-videos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 8px 0;
  max-height: 12vh;
}

.publisher-video-area,
.subscriber-video-area {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 4. 닉네임 스타일 */
.nickname {
  position: absolute;
  bottom: 5px;
  left: 5px;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.8em;
}

/* 5. 비디오 아이템 스타일 */
.video-item {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background-color: black;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 6. 컨트롤바 스타일 */
.control-bar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px 0;
  z-index: 50;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.control-bar {
  width: 100%;
  max-width: 1000px;
  position: relative;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 12px;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
}

.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.left-controls {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
}

.right-controls {
  position: static;
  margin-left: auto;
}

/* ------------------------------------------------ */
/* === 전체화면 전용 스타일 === */
/* 기본 전체 화면 설정 */
html:fullscreen,
body:fullscreen,
#app:fullscreen,
.v-application:fullscreen {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 🚀 1. 최상위 컨테이너: 뷰포트 전체 점유 및 모든 패딩/마진 제거 */
:fullscreen .openvidu-container,
.openvidu-container:fullscreen,
:-webkit-full-screen .openvidu-container,
.openvidu-container:-webkit-full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  max-width: none;
  margin: 0;
  padding: 0;
  background-color: #0e0e10;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ⚡️ 전체 화면에서 썸네일 Row 숨기기 */
:fullscreen .remote-videos,
.openvidu-container:fullscreen .remote-videos {
  display: none;
}

/* 🚀 2. 메인 비디오 ROW (.main-video-row): 뷰포트 전체를 덮도록 강제 확장 */
:fullscreen .main-video-row,
.openvidu-container:fullscreen .main-video-row {
  flex-grow: 1;
  height: 100vh;
  /* 뷰포트 높이 강제 */
  width: 100vw;
  /* 👈 뷰포트 너비 강제 */
  margin: 0;
  padding: 0;
}

/* 🚀 3. 메인 비디오 영역 (.main-video-area - V-col): transform 초기화 및 100% 확장 */
:fullscreen .main-video-area,
.openvidu-container:fullscreen .main-video-area,
:-webkit-full-screen .main-video-area,
.openvidu-container:-webkit-full-screen .main-video-area {
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transform: none;
  /* 👈 !important 제거 */
  flex: none;
  max-width: 100vw;
  /* V-col의 max-width 무력화 */
  width: 100vw;
  height: 100vh;
}

/* 🚀 4. 메인 비디오 컨테이너 (#main-video-container): 부모 크기를 100% 채우도록 함 (Position Relative 기준점) */
:fullscreen #main-video-container,
.openvidu-container:fullscreen #main-video-container {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  position: relative;
  /* 👈 하위 비디오의 absolute를 위한 기준점 */
}

/* ⚡️ 5. 비디오 요소 최종 크기 및 비율 강제 설정 (::v-deep 사용으로 !important 제거) */
/* ::v-deep를 사용하여 VideoStream 컴포넌트 내부의 <video> 태그에 직접 적용 */
:fullscreen #main-video-container ::v-deep video,
.openvidu-container:fullscreen #main-video-container ::v-deep video,
:-webkit-full-screen #main-video-container ::v-deep video,
.openvidu-container:-webkit-full-screen #main-video-container ::v-deep video {
  position: absolute;
  /* 👈 부모 기준 절대 위치 */
  top: 0;
  left: 0;
  width: 100%;
  /* 👈 100vw/100vh로 커진 부모를 꽉 채움 */
  height: 100%;
  /* 👈 100vw/100vh로 커진 부모를 꽉 채움 */
  object-fit: cover;
  /* 꽉 채우기 모드 */
  min-width: 100%;
  min-height: 100%;
  background-color: black;
  margin: 0;
  padding: 0;
  z-index: 1;
}

/* 6. 전체화면 닉네임 스타일 */
:fullscreen .nickname,
.openvidu-container:fullscreen .nickname {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  z-index: 10000;
}
</style>