<template>
  <div class="admin-dashboard">
    <!-- 헤더 네비게이션 -->
    <div class="admin-header">
      <div class="nav-buttons">
        <button class="nav-btn prev-btn">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none">
            <path d="M19 10L12 15.5L19 21" stroke="#2A2828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-btn next-btn">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none">
            <path d="M12 10L19 15.5L12 21" stroke="#2A2828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="admin-nav-tabs">
        <div class="nav-tab active">권한 그룹</div>
        <div class="nav-tab">사용자 그룹</div>
        <div class="nav-tab">대시보드</div>
        <div class="nav-tab">회원 관리</div>
        <div class="nav-tab">워크스페이스 관리</div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="admin-content">
      <div class="content-header">
        <h1 class="main-title">오늘의 일정</h1>
        <p class="sub-title">적을 거 있으면 적으십쇼</p>
      </div>
      
      <!-- 관리자 대시보드 콘텐츠 -->
      <div class="dashboard-content">
        <div class="admin-cards">
          <div class="admin-card">
            <h3>사용자 통계</h3>
            <p>총 사용자: 1,234명</p>
            <p>활성 사용자: 856명</p>
          </div>
          
          <div class="admin-card">
            <h3>워크스페이스 통계</h3>
            <p>총 워크스페이스: 45개</p>
            <p>활성 워크스페이스: 38개</p>
          </div>
          
          <div class="admin-card">
            <h3>시스템 상태</h3>
            <p>서버 상태: 정상</p>
            <p>데이터베이스: 정상</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      // 관리자 대시보드 데이터
    };
  },
  methods: {
    // 관리자 기능 메서드들
  }
};
</script>

<style scoped>
.admin-dashboard {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #F5F5F5;
  overflow: hidden;
}

.admin-header {
  position: absolute;
  width: 100%;
  height: 83px;
  top: 0;
  left: 0;
  background: #F5F5F5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-btn {
  width: 31px;
  height: 31px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.admin-nav-tabs {
  display: flex;
  gap: 30px;
  flex: 1;
}

.nav-tab {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 33px;
  color: #1C0F0F;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 4px solid transparent;
  transition: all 0.2s;
}

.nav-tab:hover {
  color: #FFDD44;
}

.nav-tab.active {
  color: #1C0F0F;
  border-bottom-color: #FFDD44;
}

.admin-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 83px;
  bottom: 0;
  overflow-y: auto;
  padding: 20px;
}

.content-header {
  margin-bottom: 30px;
}

.main-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  color: #1C0F0F;
  margin: 0 0 10px 0;
}

.sub-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #666666;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.admin-card {
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-card h3 {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: #1C0F0F;
  margin: 0 0 15px 0;
}

.admin-card p {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #666666;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .admin-nav-tabs {
    gap: 15px;
  }
  
  .nav-tab {
    font-size: 20px;
    line-height: 24px;
  }
  
  .admin-cards {
    grid-template-columns: 1fr;
  }
}
</style>
