<template>
  <div class="admin-dashboard">
    <!-- 관리자 페이지 헤더 -->
    <div class="admin-header">
      <div class="admin-nav-tabs">
        <div class="nav-tab active" @click="setActiveTab('permission')">권한 그룹</div>
        <div class="nav-tab" @click="setActiveTab('user')">사용자 그룹</div>
        <div class="nav-tab" @click="setActiveTab('dashboard')">대시보드</div>
        <div class="nav-tab" @click="setActiveTab('member')">회원 관리</div>
        <div class="nav-tab" @click="setActiveTab('workspace')">워크스페이스 관리</div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="admin-content">
      <!-- 권한 그룹 -->
      <div v-if="activeTab === 'permission'" class="tab-content">
        <div class="content-header">
          <h1 class="main-title">권한 그룹 관리</h1>
          <p class="sub-title">시스템 권한을 관리합니다</p>
        </div>
        
        <div class="admin-cards">
          <div class="admin-card">
            <h3>관리자 권한</h3>
            <p>총 관리자: 5명</p>
            <p>활성 관리자: 3명</p>
          </div>
          
          <div class="admin-card">
            <h3>일반 사용자 권한</h3>
            <p>총 사용자: 1,200명</p>
            <p>활성 사용자: 850명</p>
          </div>
          
          <div class="admin-card">
            <h3>게스트 권한</h3>
            <p>총 게스트: 29명</p>
            <p>활성 게스트: 3명</p>
          </div>
        </div>

      </div>

      <!-- 사용자 그룹 -->
      <div v-if="activeTab === 'user'" class="tab-content">
        <div class="content-header">
          <h1 class="main-title">사용자 그룹 관리</h1>
          <p class="sub-title">사용자 그룹을 관리합니다</p>
        </div>
        
        <div class="admin-cards">
          <div class="admin-card">
            <h3>개발팀</h3>
            <p>총 멤버: 15명</p>
            <p>활성 멤버: 12명</p>
          </div>
          
          <div class="admin-card">
            <h3>디자인팀</h3>
            <p>총 멤버: 8명</p>
            <p>활성 멤버: 6명</p>
          </div>
          
          <div class="admin-card">
            <h3>마케팅팀</h3>
            <p>총 멤버: 10명</p>
            <p>활성 멤버: 8명</p>
          </div>
        </div>
      </div>

      <!-- 대시보드 -->
      <div v-if="activeTab === 'dashboard'" class="tab-content">
        <div class="content-header">
          <h1 class="main-title">오늘의 일정</h1>
          <p class="sub-title">적을 거 있으면 적으십쇼</p>
        </div>
        
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

      <!-- 회원 관리 -->
      <div v-if="activeTab === 'member'" class="tab-content">
        <div class="content-header">
          <h1 class="main-title">회원 관리</h1>
          <p class="sub-title">회원 정보를 관리합니다</p>
        </div>
        
        <div class="admin-cards">
          <div class="admin-card">
            <h3>신규 가입자</h3>
            <p>이번 주: 25명</p>
            <p>이번 달: 120명</p>
          </div>
          
          <div class="admin-card">
            <h3>탈퇴 회원</h3>
            <p>이번 주: 3명</p>
            <p>이번 달: 15명</p>
          </div>
          
          <div class="admin-card">
            <h3>활성 회원</h3>
            <p>일일 활성: 856명</p>
            <p>주간 활성: 1,200명</p>
          </div>
        </div>
      </div>

      <!-- 워크스페이스 관리 -->
      <div v-if="activeTab === 'workspace'" class="tab-content">
        <div class="content-header">
          <h1 class="main-title">워크스페이스 관리</h1>
          <p class="sub-title">워크스페이스를 관리합니다</p>
        </div>
        
        <div class="admin-cards">
          <div class="admin-card">
            <h3>전체 워크스페이스</h3>
            <p>총 워크스페이스: 45개</p>
            <p>활성 워크스페이스: 38개</p>
          </div>
          
          <div class="admin-card">
            <h3>새로운 워크스페이스</h3>
            <p>이번 주: 3개</p>
            <p>이번 달: 12개</p>
          </div>
          
          <div class="admin-card">
            <h3>스토리지 사용량</h3>
            <p>전체 사용량: 4.8GB</p>
            <p>사용 가능: 5.2GB</p>
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
      activeTab: 'permission'
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      // 모든 탭에서 active 클래스 제거
      document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.remove('active');
      });
      // 클릭된 탭에 active 클래스 추가
      event.target.classList.add('active');
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  position: fixed;
  top: 83px;
  left: 280px;
  right: 0;
  bottom: 0;
  width: calc(100vw - 280px);
  height: calc(100vh - 83px);
  background: #F5F5F5 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
}

.admin-header {
  background: #F5F5F5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 30px;
  flex-shrink: 0;
  overflow-x: auto;
  z-index: 200;
}

.admin-nav-tabs {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  min-width: max-content;
}

.nav-tab {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #1C0F0F;
  cursor: pointer;
  padding: 10px 15px;
  border-bottom: 4px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-tab:hover {
  color: #FFDD44;
}

.nav-tab.active {
  color: #1C0F0F;
  border-bottom-color: #FFDD44;
}

.admin-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background: #F5F5F5;
}

.tab-content {
  width: 100%;
  height: 100%;
}

.content-header {
  margin-bottom: 30px;
  text-align: left;
}

.main-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 24px;
  line-height: 28px;
  color: #1C0F0F;
  margin: 0 0 15px 0;
  text-align: left;
}

.sub-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: #666666;
  margin: 0;
  text-align: left;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 100%;
}

.admin-card {
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 100%;
}

.admin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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
  line-height: 18px;
  color: #666666;
  margin: 6px 0;
}


@media (max-width: 1200px) {
  .admin-dashboard {
    left: 240px;
    width: calc(100vw - 240px);
  }
  
  .admin-nav-tabs {
    gap: 15px;
  }
  
  .nav-tab {
    font-size: 20px;
    line-height: 24px;
    padding: 8px 12px;
  }
  
  .admin-cards {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    left: 0;
    top: 83px;
    width: 100vw;
    height: calc(100vh - 83px);
  }
  
  .admin-nav-tabs {
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .nav-tab {
    font-size: 16px;
    line-height: 20px;
    padding: 8px 12px;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .admin-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .admin-card {
    padding: 20px;
  }
}
</style>
