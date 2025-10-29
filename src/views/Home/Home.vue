<template>
  <div class="home-container">
    <!-- 메인 컨텐츠 영역 -->
    <div class="main-content">
      <!-- 상단 헤더 -->
      <div class="content-header">
        <div class="date-section">
          <h1 class="main-title">오늘의 일정</h1>
          <p class="today-date">{{ todayDate }}</p>
        </div>
      </div>

      <!-- 컨텐츠 그리드 -->
      <div class="content-grid">
        <!-- 왼쪽 컬럼 -->
        <div class="left-column">
          <!-- 프로젝트 목록 섹션 -->
          <div class="project-section">
            <div class="section-header">
              <h2 class="section-title">프로젝트 목록</h2>
              <button class="add-button">+ 프로젝트 추가</button>
            </div>
            <div class="gantt-chart">
              <div class="gantt-header">
                <div class="month-labels">
                  <span>9월</span>
                  <span>10월</span>
                  <span>11월</span>
                  <span>12월</span>
                </div>
                <div class="today-line"></div>
              </div>
              <div class="gantt-bars">
                <div class="gantt-bar" v-for="project in projects" :key="project.id" :style="project.style">
                  <div class="bar-content">
                    <div class="project-name">{{ project.name }}</div>
                    <div class="project-period">{{ project.period }}</div>
                    <div class="project-progress">{{ project.progress }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 마일스톤 섹션 -->
          <div class="milestone-section">
            <div class="section-header">
              <h2 class="section-title">마일스톤</h2>
              <button class="add-button">+ 마일스톤 추가</button>
            </div>
            <div class="milestone-progress">
              <div class="progress-circles">
                <div class="progress-circle" v-for="milestone in milestones" :key="milestone.id">
                  <div class="circle-outer">
                    <div class="circle-inner" :style="{ '--progress': milestone.progress }"></div>
                  </div>
                  <div class="progress-text">{{ milestone.progress }}%</div>
                  <div class="milestone-name">{{ milestone.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽 컬럼 -->
        <div class="right-column">
          <div class="right-top-row">
            <!-- 기한 임박 Task 섹션 -->
            <div class="urgent-tasks-section">
              <h2 class="section-title">⏰ 기한 임박 Task</h2>
              <div class="progress-section">
                <h3 class="progress-title">일정별 진행률</h3>
                <div class="task-list">
                  <div class="task-item" v-for="task in urgentTasks" :key="task.id">
                    <div class="task-progress-bar">
                      <div class="progress-fill" :style="{ width: task.progress + '%', backgroundColor: task.color }"></div>
                    </div>
                    <div class="task-content">
                      <span class="task-name">{{ task.name }}</span>
                      <span class="task-deadline">{{ task.deadline }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 채팅 알림 섹션 -->
            <div class="chat-notifications-section">
              <div class="notifications-header">
                <h2 class="section-title">채팅 알림</h2>
                <div class="notification-badge">8</div>
              </div>
              <div class="notifications-list">
                <div class="notification-item" v-for="notification in chatNotifications" :key="notification.id">
                  <div class="notification-avatar"></div>
                  <div class="notification-content">
                    <div class="notification-header">
                      <span class="sender-name">{{ notification.sender }}</span>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                    <div class="notification-message">{{ notification.message }}</div>
                  </div>
                  <div class="notification-menu">
                    <div class="menu-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 나의 스톤 문서함 섹션 -->
          <div class="stone-documents-section">
            <h2 class="section-title">나의 스톤 문서함</h2>
            <div class="document-list">
              <div class="document-folder" v-for="folder in documentFolders" :key="folder.id">
                <div class="folder-header" :style="{ backgroundColor: folder.color }">
                  <span class="folder-name">📁 {{ folder.name }}</span>
                </div>
                <div class="folder-content">
                  <div class="document-item" v-for="doc in folder.documents" :key="doc.id">
                    <span class="doc-icon">📄</span>
                    <span class="doc-name">{{ doc.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workspaceWatcher } from '@/mixins/workspaceWatcher';

export default {
  name: "Home",
  mixins: [workspaceWatcher],
  
  data() {
    return {
      todayDate: 'Today 2025.09.25',
      projects: [
        {
          id: 1,
          name: '한화시스템 일정관리 웹서비스 MVP 개발',
          period: '9/1 - 11/15',
          progress: 75,
          style: {
            left: '7.2%',
            width: '12.07%',
            backgroundColor: '#FFE364'
          }
        },
        {
          id: 2,
          name: '인프런 강의 플랫폼 개발',
          period: '9/15 - 12/30',
          progress: 45,
          style: {
            left: '9.63%',
            width: '15.25%',
            backgroundColor: '#FFE364'
          }
        },
        {
          id: 3,
          name: 'React Native 모바일 앱 개발',
          period: '10/1 - 12/15',
          progress: 20,
          style: {
            left: '12.07%',
            width: '10.98%',
            backgroundColor: '#FFE364'
          }
        },
        {
          id: 4,
          name: 'AI 챗봇 서비스 구축',
          period: '11/1 - 1/15',
          progress: 5,
          style: {
            left: '16.95%',
            width: '12.32%',
            backgroundColor: '#FFE364'
          }
        }
      ],
      milestones: [
        { id: 1, progress: 60, name: '프로젝트 설계' },
        { id: 2, progress: 80, name: '개발 완료' }
      ],
      urgentTasks: [
        {
          id: 1,
          name: '한화시스템 MVP 개발',
          progress: 75,
          deadline: 'D-1',
          color: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)'
        },
        {
          id: 2,
          name: '인프런 플랫폼 리뷰',
          progress: 50,
          deadline: 'D-2',
          color: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)'
        },
        {
          id: 3,
          name: 'React Native 테스트',
          progress: 20,
          deadline: 'D-3',
          color: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)'
        },
        {
          id: 4,
          name: 'AI 챗봇 서비스 설계',
          progress: 5,
          deadline: 'D-5',
          color: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
        },
        {
          id: 5,
          name: '데이터베이스 최적화',
          progress: 30,
          deadline: 'D-2',
          color: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)'
        }
      ],
      documentFolders: [
        {
          id: 1,
          name: '한화시스템 일정관리 웹서비스',
          color: 'linear-gradient(90deg, #FFE364 0%, #FFD700 100%)',
          documents: [
            { id: 1, name: '요구사항 문서' },
            { id: 2, name: '설계 문서' },
            { id: 3, name: '테스트 계획서' }
          ]
        },
        {
          id: 2,
          name: '인프런 강의 플랫폼',
          color: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
          documents: [
            { id: 4, name: '기획서' },
            { id: 5, name: 'UI/UX 디자인' }
          ]
        },
        {
          id: 3,
          name: 'React Native 모바일 앱',
          color: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)',
          documents: [
            { id: 6, name: '앱 설계서' },
            { id: 7, name: 'API 문서' }
          ]
        }
      ],
      chatNotifications: [
        {
          id: 1,
          sender: '조민형',
          message: '어제 미팅자료 잘 정리해놓으세요~~',
          time: '15분 전'
        },
        {
          id: 2,
          sender: '조민형 외 2명',
          message: '어제 미팅자료 잘 정리해놓으세요~~',
          time: '어제'
        },
        {
          id: 3,
          sender: '김현지 외 4명',
          message: '어제 미팅자료 잘 정리하시고 각자 맡은 업...',
          time: '2025-09-23'
        }
      ]
    };
  },
  
  methods: {
    // 워크스페이스 변경 감지 메서드 오버라이드
    onWorkspaceChanged(workspaceData) {
      console.log('Home: 워크스페이스 변경됨', workspaceData);
      this.refreshHomeData();
    },
    
    refreshHomeData() {
      console.log('홈 페이지 데이터 새로고침');
    }
  }
};
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: #F5F5F5;
  overflow: hidden;
}

.main-content {
  margin-left: 280px;
  padding: 83px 30px 0;
  height: 100vh;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 30px;
}

.main-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 33px;
  color: #1C0F0F;
  margin: 0 0 8px 0;
}

.today-date {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #666666;
  margin: 0;
}

.content-grid {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.right-column {
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.right-top-row {
  display: flex;
  gap: 30px;
}

/* 프로젝트 섹션 */
.project-section {
  background: #FFFFFF;
  border-radius: 15px;
  padding: 20px;
  height: 300px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #1C0F0F;
  margin: 0;
}

.add-button {
  background: #2A2828;
  border-radius: 8px;
  border: none;
  color: #FFFFFF;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  padding: 5px 12px;
  cursor: pointer;
}

/* 간트 차트 */
.gantt-chart {
  height: 200px;
  position: relative;
}

.gantt-header {
  position: relative;
  height: 40px;
  margin-bottom: 20px;
}

.month-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: #666666;
}

.today-line {
  position: absolute;
  left: 19.39%;
  top: 20px;
  width: 2px;
  height: 20px;
  background: #FF4444;
  border: 2px dashed #FF4444;
}

.today-line::before {
  content: 'Today';
  position: absolute;
  top: -15px;
  left: -15px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: #FF4444;
}

.gantt-bars {
  position: relative;
  height: 120px;
}

.gantt-bar {
  position: absolute;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  top: 0;
}

.gantt-bar:nth-child(1) {
  top: 0px;
}

.gantt-bar:nth-child(2) {
  top: 30px;
}

.gantt-bar:nth-child(3) {
  top: 60px;
}

.gantt-bar:nth-child(4) {
  top: 90px;
}

.bar-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.project-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
  color: #2A2828;
  flex: 1;
}

.project-period {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
  color: #666666;
}

.project-progress {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
  color: #000000;
}

/* 마일스톤 섹션 */
.milestone-section {
  background: #FFFFFF;
  border-radius: 15px;
  padding: 20px;
  height: 300px;
}

.milestone-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.progress-circles {
  display: flex;
  gap: 30px;
  align-items: center;
}

.progress-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.circle-outer {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  border: 20px solid #2A2828;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 20px solid #FFFFFF;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  position: relative;
}

.circle-inner::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 50%;
  background: conic-gradient(#FFE364 0deg, #FFE364 calc(var(--progress) * 3.6deg), #E9ECEF calc(var(--progress) * 3.6deg));
  z-index: -1;
}

.circle-outer:nth-child(1) .circle-inner::before {
  background: conic-gradient(#FFE364 0deg, #FFE364 calc(60 * 3.6deg), #E9ECEF calc(60 * 3.6deg));
}

.circle-outer:nth-child(2) .circle-inner::before {
  background: conic-gradient(#FFE364 0deg, #FFE364 calc(80 * 3.6deg), #E9ECEF calc(80 * 3.6deg));
}

.progress-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
}

.milestone-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #666666;
  text-align: center;
  margin-top: 5px;
}

/* 기한 임박 Task 섹션 */
.urgent-tasks-section {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  border-radius: 15px;
  padding: 20px;
  height: 400px;
  flex: 1;
}

.progress-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #1C0F0F;
  margin: 10px 0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.task-item:last-child {
  margin-bottom: 0;
}

.task-progress-bar {
  width: 200px;
  height: 8px;
  background: #E2E8F0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.task-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 9px;
  line-height: 11px;
  color: #FFFFFF;
}

.task-deadline {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 9px;
  line-height: 11px;
  color: #FF6B6B;
}

/* 나의 스톤 문서함 섹션 */
.stone-documents-section {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  border-radius: 15px;
  padding: 20px;
  height: 300px;
  overflow-y: auto;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.document-folder {
  border-radius: 8px;
  overflow: hidden;
}

.folder-header {
  padding: 8px 12px;
  border-radius: 8px 8px 0 0;
}

.folder-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
}

.folder-content {
  background: #F8FAFC;
  padding: 8px 12px;
  border-radius: 0 0 8px 8px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.doc-icon {
  font-size: 10px;
}

.doc-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #666666;
}

/* 채팅 알림 섹션 */
.chat-notifications-section {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
  height: 400px;
  width: 350px;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notification-badge {
  background: #FF1717;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: #FFFFFF;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #F0F0F0;
}

.notification-avatar {
  width: 32px;
  height: 32px;
  background: #2A2828;
  border-radius: 50%;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sender-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: #000000;
}

.notification-time {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: #484646;
}

.notification-message {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: #484646;
}

.notification-menu {
  position: relative;
  cursor: pointer;
}

.menu-dot {
  width: 4px;
  height: 4px;
  background: #2A2828;
  border-radius: 50%;
}

.menu-dot::before,
.menu-dot::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #2A2828;
  border-radius: 50%;
}

.menu-dot::before {
  top: -6px;
}

.menu-dot::after {
  top: 6px;
}
</style>

