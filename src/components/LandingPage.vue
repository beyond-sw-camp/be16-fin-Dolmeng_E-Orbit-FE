<template>
  <div class="landing-root">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <div class="logo-row">
          <img class="logo-img" src="@/assets/icons/logo/1_2.svg" alt="Orbit Logo" />
          <div class="logo-text">ORBIT</div>
        </div>

        <h1 class="hero-title">일정 관리의 새로운 시대를 열다</h1>
        <p class="hero-subtitle">쉽고 직관적인 방식으로,당신의 프로젝트를 완벽하게 이끌어보세요.</p>

        <div class="hero-cta">
          <v-btn class="start-btn" rounded="lg" color="#FFE364" @click="$router.push('/login')">시작하기</v-btn>
        </div>
      </div>
    </section>

    <!-- Intro Copy -->
    <section class="intro">
      <p class="intro-text">계획, 소통, 진행 현황, 자동화까지.</p>
      <p class="intro-text">프로젝트 관리에 필요한 모든 것을 한 곳에서 경험하세요.</p>
    </section>

    <!-- Feature Sections -->
    <section class="feature-area">
      <div class="feature-images">
        <SectionCard
          v-for="feature in featureCards"
          :key="feature.title"
          class="feature-section-card"
          :title="feature.title"
          :subtitle="feature.description"
        >
          <div class="feature-card-media">
            <img class="feature-image" :src="feature.icon" :alt="feature.title" />
          </div>
        </SectionCard>
      </div>
    </section>

    <section class="intro intro-tight">
      <p class="intro-text">스마트한 일정 관리부터 실시간 협업, 프로젝트 모니터링, 자동화까지</p>
      <p class="intro-text">팀의 모든 업무를 하나로 연결합니다.</p>
    </section>

    <!-- Gallery (overlapped) -->
    <section class="gallery-area">
      <div class="gallery-stacked">
        <div class="pair">
          <v-card class="img-card img left" elevation="4" rounded="xl">
            <img class="gallery-media" :src="landingImage2" alt="메인 타임라인" />
          </v-card>
          <v-card class="img-card img right" elevation="4" rounded="xl">
            <video
              class="gallery-media"
              :src="galleryVideo"
              autoplay
              muted
              loop
              playsinline
            ></video>
          </v-card>
        </div>
        <div class="overlay-video">
          <v-card class="video-card landing-video-wrap" elevation="6" rounded="xl">
            <video
              class="landing-video"
              :src="landingVideo"
              autoplay
              muted
              loop
              playsinline
            ></video>
          </v-card>
        </div>
      </div>
    </section>
  </div>
  
</template>

<script>
import landingVideo from '@/assets/videos/landing/Orbing(Project_summary,tasks).mp4';
import landingImage2 from '@/assets/icons/landing/2-2.png';
import scheduleIcon from '@/assets/icons/landing/1-1.png';
import progressIcon from '@/assets/icons/landing/1-2.png';
import documentIcon from '@/assets/icons/landing/1-3.png';
import collaborationIcon from '@/assets/icons/landing/1-4.png';
import galleryVideo from '@/assets/icons/landing/2-1.mp4';
import SectionCard from '@/components/common/SectionCard.vue';
export default {
  name: 'LandingPage',
  components: {
    SectionCard
  },
  data() {
    return { 
      landingVideo,
      landingImage2,
      galleryVideo,
      featureCards: [
        {
          title: '일정관리',
          description: '팀 일정과 마일스톤을 한눈에 조율해요.',
          icon: scheduleIcon
        },
        {
          title: '프로젝트 현황',
          description: '실시간 진행 현황으로 빠르게 대응해요.',
          icon: progressIcon
        },
        {
          title: '문서관리',
          description: '핵심 문서를 안전하게 보관하고 찾아요.',
          icon: documentIcon
        },
        {
          title: '협업 & 소통',
          description: '팀 커뮤니케이션과 협업 흐름을 이어가요.',
          icon: collaborationIcon
        }
      ],
    };
  }
};
</script>

<style scoped>
.landing-root {
  width: 100%;
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
}

/* Hero */
.hero {
  position: relative;
  background: #2A2828;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-inner {
  position: relative;
  width: min(1200px, 92%);
  padding: 56px 16px 48px;
  text-align: center;
}
.logo-row {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.logo-img { width: 40px; height: 40px; border-radius: 20%; display: block; }
.logo-text {
  font-family: 'Pretendard', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: 32px;
  color: #FFFFFF;
}
.hero-title {
  margin: 0;
  margin-top: 36px;
  font-family: 'Pretendard', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: clamp(26px, 3.8vw, 44px);
  line-height: 1.2;
  color: #FFFFFF;
}
.hero-subtitle {
  margin: 8px 0 0;
  font-family: 'Pretendard', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: clamp(16px, 2.2vw, 24px);
  color: #F5F5F5;
}
.hero-cta { margin-top: 28px; }
.start-btn {
  background: #FFE364 !important;
  color: #1C0F0F !important;
  font-weight: 700 !important;
  height: 42px !important;
  font-size: 16px !important;
  padding: 0 28px !important;
}
/* 시작하기 버튼 포커스 링 제거 */
.start-btn:focus,
.start-btn:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
:deep(.start-btn .v-btn__overlay),
:deep(.start-btn .v-btn__underlay) {
  display: none !important;
}
.start-btn { -webkit-tap-highlight-color: transparent; }

/* Intro copy */
.intro {
  padding: 64px 16px 8px;
}
.intro-tight {
  padding-top: 28px;
  padding-bottom: 0;
}
.intro-text {
  margin: 0 auto;
  text-align: center;
  width: min(900px, 92%);
  font-weight: 800;
  font-size: 24px;
  color: #1C0F0F;
}

/* Feature sections */
.feature-area {
  position: relative;
  margin: 16px auto 80px;
  padding: 48px 16px 64px;
  display: flex;
  justify-content: center;
}
.feature-area::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(1480px, calc(100% - 32px));
  height: 100%;
  background: linear-gradient(135deg, #FFE68A 0%, #FFD563 55%, #FFC446 100%);
  border-radius: 42px;
  clip-path: polygon(0 14%, 100% 0, 100% 86%, 0% 100%);
  box-shadow: 0 24px 48px rgba(255, 196, 80, 0.28);
  z-index: 0;
  pointer-events: none;
}
.feature-images {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  width: min(1440px, 100%);
}
.feature-section-card {
  padding: 24px;
  height: 380px;
  display: flex;
  flex-direction: column;
}
:deep(.feature-section-card .section-card-header) {
  margin: 0 0 14px;
  padding: 0;
  border-bottom: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
:deep(.feature-section-card .section-card-title) {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #151414;
}
:deep(.feature-section-card .section-card-subtitle) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.01em;
  background: rgba(224, 224, 224, 0.38);
  color: #3B3B3B;
}
.feature-section-card:nth-child(1) :deep(.section-card-subtitle) {
  background: rgba(117, 212, 190, 0.26);
  color: #0F6B55;
}
.feature-section-card:nth-child(2) :deep(.section-card-subtitle) {
  background: rgba(176, 169, 255, 0.28);
  color: #3B2BA6;
}
.feature-section-card:nth-child(3) :deep(.section-card-subtitle) {
  background: rgba(255, 194, 168, 0.3);
  color: #A14A1C;
}
.feature-section-card:nth-child(4) :deep(.section-card-subtitle) {
  background: rgba(255, 219, 162, 0.3);
  color: #7A4A00;
}
.feature-section-card :deep(.section-card-content) {
  flex: 1;
  display: flex;
}
.feature-card-media {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
}
.feature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  display: block;
}
/* Gallery */
.gallery-area {
  position: relative;
  margin: 32px auto 140px;
  padding: 80px 16px 112px;
  display: flex;
  justify-content: center;
}
.gallery-area::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: 0 auto;
  width: min(1480px, calc(100% - 32px));
  background: linear-gradient(120deg, #BCEBFF 0%, #C8B7FF 48%, #FFB6D8 100%);
  border-radius: 52px;
  clip-path: polygon(2% 12%, 100% 0%, 98% 100%, 0% 88%);
  box-shadow: 0 30px 78px rgba(140, 126, 255, 0.26);
  z-index: 0;
  pointer-events: none;
}
.gallery-area::after {
  content: "";
  position: absolute;
  bottom: 12%;
  left: 8%;
  width: clamp(120px, 12vw, 220px);
  height: clamp(120px, 12vw, 220px);
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 68%),
    radial-gradient(circle at 30% 60%, rgba(125, 205, 255, 0.55), rgba(125, 205, 255, 0) 74%),
    radial-gradient(circle at 70% 40%, rgba(158, 133, 255, 0.52), rgba(158, 133, 255, 0) 76%),
    radial-gradient(circle at 55% 60%, rgba(255, 160, 210, 0.5), rgba(255, 160, 210, 0) 78%);
  border-radius: 50%;
  filter: blur(0.6px);
  opacity: 0.95;
  z-index: 0;
}
.gallery-stacked {
  position: relative;
  width: min(1440px, 92%);
  margin: 0 auto;
  z-index: 1;
}
.gallery-stacked .pair {
  display: flex;
  gap: 46px;
  margin-top: 60px;
}
.gallery-stacked .pair .img,
.gallery-stacked .pair .img-card {
  flex: 1 1 50%;
  height: 420px;
  border-radius: 16px;
  overflow: hidden;
}
.gallery-media,
.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gallery-stacked .pair .img.left { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.gallery-stacked .pair .img.right { border-top-left-radius: 0; border-bottom-left-radius: 0; }
.gallery-stacked .overlay-video {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  z-index: 2;
  display: flex;
  justify-content: center;
}
.gallery-stacked .overlay-video .landing-video-wrap,
.gallery-stacked .overlay-video .video-card { width: 48%; }
.landing-video-wrap { width: 70%; overflow: hidden; border-radius: 15px; border: 1px solid #E0E0E0; }
.landing-video { width: calc(100% + 5px); height: auto; display: block; transform: translateX(-1px); }

@media (max-width: 1200px) {
  .feature-area {
    margin: 12px auto 64px;
    padding: 40px 16px 56px;
  }
  .feature-area::before {
    width: min(1320px, calc(100% - 24px));
    border-radius: 36px;
    clip-path: polygon(0 18%, 100% 0, 100% 82%, 0% 100%);
  }
  .feature-images { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .feature-section-card { height: 320px; }
  .feature-card-media { height: 260px; }
  .gallery-area {
    margin: 28px auto 120px;
    padding: 68px 16px 96px;
  }
  .gallery-area::before {
    width: min(1320px, calc(100% - 24px));
    border-radius: 44px;
    clip-path: polygon(4% 14%, 100% 0%, 96% 100%, 0% 90%);
  }
  .gallery-area::after {
    bottom: 14%;
    left: 10%;
    width: clamp(110px, 18vw, 200px);
    height: clamp(110px, 18vw, 200px);
  }
  .gallery-stacked { width: min(1240px, 94%); }
  .gallery-stacked .pair {
    gap: 32px;
    margin-top: 48px;
  }
  .gallery-stacked .pair .img,
  .gallery-stacked .pair .img-card { height: 360px; }
  .gallery-stacked .overlay-video .landing-video-wrap,
  .gallery-stacked .overlay-video .video-card { width: 56%; }
}

@media (max-width: 640px) {
  .hero-inner { padding-top: 72px; }
  .start-btn { height: 48px !important; }
  .feature-area {
    margin: 8px auto 48px;
    padding: 32px 12px 44px;
  }
  .feature-area::before {
    width: calc(100% - 16px);
    border-radius: 28px;
    clip-path: polygon(0 22%, 100% 0, 100% 78%, 0% 100%);
  }
  .feature-images { grid-template-columns: 1fr; }
  .feature-section-card { height: 300px; }
  .feature-card-media { height: 220px; }
  .gallery-area {
    margin: 20px auto 92px;
    padding: 52px 12px 74px;
  }
  .gallery-area::before {
    width: calc(100% - 18px);
    border-radius: 32px;
    clip-path: polygon(8% 20%, 100% 0%, 92% 100%, 0% 82%);
  }
  .gallery-area::after {
    bottom: 18%;
    left: 12%;
    width: clamp(120px, 42vw, 200px);
    height: clamp(120px, 42vw, 200px);
  }
  .gallery-stacked { width: 100%; }
  .gallery-stacked .pair {
    flex-direction: column;
    gap: 24px;
    margin-top: 40px;
  }
  .gallery-stacked .pair .img,
  .gallery-stacked .pair .img-card {
    height: 260px;
    border-radius: 18px;
  }
  .gallery-stacked .pair .img.left,
  .gallery-stacked .pair .img.right {
    border-radius: 18px;
  }
  .gallery-stacked .overlay-video {
    position: static;
    transform: none;
    margin-top: 32px;
  }
  .gallery-stacked .overlay-video .landing-video-wrap,
  .gallery-stacked .overlay-video .video-card {
    width: 82%;
  }
}
</style>


