
<template>
  <div ref="videoContainer" class="video-stream"></div>
</template>

<script>
export default {
  name: 'VideoStream',
  props: { streamManager: Object },
  mounted() {
    // Vue DOM 렌더링이 완료된 후 스트림 부착 시작
    this.$nextTick(() => this.tryAttachStream()); 
  },
  watch: {
    streamManager() {
      this.tryAttachStream();
    }
  },
  beforeUnmount() {
    this.cleanupVideo();
  },
  methods: {
    cleanupVideo() {
      // 컴포넌트가 정리될 때 DOM에서 비디오 요소를 제거합니다.
      if (this.$refs.videoContainer) {
        this.$refs.videoContainer.querySelectorAll('video').forEach(v => {
          v.srcObject = null;
          v.remove();
        });
      }
    },
    tryAttachStream() {
      this.cleanupVideo(); // 이전 스트림 정리

      const container = this.$refs.videoContainer;

      // 스트림 또는 컨테이너 준비 확인
      if (!this.streamManager || !container) {
        setTimeout(this.tryAttachStream, 200);
        return;
      }

      const attach = () => {
        if (!this.streamManager || !container) {
          return;
        }

        // 스트림 미디어가 준비되었는지 확인
        if (!this.streamManager.stream || typeof this.streamManager.stream.getMediaStream !== 'function') {
           setTimeout(attach, 200);
           return;
        }
        
        try {
          // **핵심 수정: 수동으로 video 요소를 생성하고 OpenVidu 스트림 연결**
          if (container.querySelector('video')) {
            // 이미 비디오 요소가 있으면 재시도 중단
            return;
          }

          const video = document.createElement('video');
          
          // MediaStream 객체를 srcObject에 할당
          video.srcObject = this.streamManager.stream.getMediaStream();
          
          // 비디오 속성 설정
          video.autoplay = true;
          video.playsinline = true; 
          video.controls = false; 
          
          // 로컬 비디오(Publisher)는 음소거하여 하울링 방지
          if (this.streamManager.stream.typeOfVideo === 'LOCAL') {
            video.muted = true;
          }

          // DOM에 비디오 요소 추가
          container.appendChild(video);
          
          video.play().catch(e => {
            console.warn('Video play failed:', e);
          });
          
        } catch (e) {
          console.error('Video attach 에러:', e, ', 200ms 후 재시도');
          setTimeout(attach, 200);
        }
      };

      this.$nextTick(() => attach());
    }
  }
};
</script>

<style scoped>
.video-stream {
  width: 100%;
  height: 100%;
  position: relative; 
  display: block; 
  background-color: transparent;
}
.video-stream > video {
  position: absolute; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>