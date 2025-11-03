
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
        // bind to this to preserve context
        setTimeout(() => this.tryAttachStream(), 200);
        return;
      }

      const attach = () => {
        if (!this.streamManager || !container) {
          return;
        }
        // OpenVidu 권장 방식: StreamManager가 비디오 요소를 관리하도록 위임
        if (!this.streamManager.stream || typeof this.streamManager.addVideoElement !== 'function') {
          setTimeout(attach, 200);
          return;
        }
        
        try {
          // **핵심 수정: OpenVidu StreamManager에 비디오 요소를 등록(addVideoElement)**
          if (container.querySelector('video')) {
            // 이미 비디오 요소가 있으면 재시도 중단
            return;
          }

          const video = document.createElement('video');
          // StreamManager가 내부에서 MediaStream을 연결
          this.streamManager.addVideoElement(video);

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

          // Try to play immediately. On browsers like Chrome autoplay with audio may be blocked.
          // If playback fails, try muting and play again to satisfy autoplay policy.
          const tryPlay = async () => {
            try {
              await video.play();
            } catch (err) {
              console.warn('Video play failed, attempting muted fallback:', err);
              try {
                // Temporarily mute to allow autoplay, then (optionally) leave muted state for remote streams
                video.muted = true;
                await video.play();
              } catch (err2) {
                console.warn('Muted play also failed:', err2);
              }
            }
          };

          // Also try to start playing when enough data is available
          const onCanPlay = () => {
            tryPlay();
            video.removeEventListener('canplay', onCanPlay);
          };
          video.addEventListener('canplay', onCanPlay);

          tryPlay();
          
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