
<template>
  <div class="video-stream">
    <video
      ref="video"
      autoplay
      playsinline
      muted
    />
  </div>
</template>

<script>
export default {
  name: 'VideoStream',
  props: {
    streamManager: {
      type: Object,
      required: false,
      default: null,
    },
  },
  watch: {
    streamManager: {
      immediate: true,
      handler(newVal, oldVal) {
        // 이전 스트림에서 비디오 엘리먼트 떼기 (가능한 경우)
        if (oldVal && this.$refs.video && typeof oldVal.removeVideoElement === 'function') {
          try {
            oldVal.removeVideoElement(this.$refs.video);
          } catch (e) {
            console.debug('removeVideoElement error:', e);
          }
        }
        this.attachStream(newVal);
      },
    },
  },
  mounted() {
    this.attachStream(this.streamManager);
  },
  beforeUnmount() {
    if (this.streamManager && this.$refs.video && typeof this.streamManager.removeVideoElement === 'function') {
      try {
        this.streamManager.removeVideoElement(this.$refs.video);
      } catch (e) {
        console.debug('removeVideoElement beforeUnmount error:', e);
      }
    }
  },
  methods: {
    attachStream(sm) {
      if (!this.$refs.video) return;

      // 스트림이 없으면 비디오 끊기
      if (!sm || !sm.stream) {
        this.$refs.video.srcObject = null;
        return;
      }

      // OpenVidu 공식 방법: addVideoElement 사용
      if (typeof sm.addVideoElement === 'function') {
        try {
          sm.addVideoElement(this.$refs.video);
          return;
        } catch (e) {
          console.error('addVideoElement error:', e);
        }
      }

      // 혹시 addVideoElement가 없는 버전일 경우를 대비한 폴백
      try {
        const mediaStream =
          sm.stream.getMediaStream && sm.stream.getMediaStream();
        if (mediaStream) {
          this.$refs.video.srcObject = mediaStream;
        }
      } catch (e) {
        console.error('fallback attachStream error:', e);
      }
    },
  },
};
</script>

<style scoped>
.video-stream {
  width: 100%;
  height: 100%;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: black;
  display: block;
}
</style>
