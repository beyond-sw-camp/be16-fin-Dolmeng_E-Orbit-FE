<template>
  <h1>Home</h1>
</template>

<script>
import { workspaceWatcher } from '@/mixins/workspaceWatcher';

export default {
  name: "Home",
  mixins: [workspaceWatcher],
  
  methods: {
    // 워크스페이스 변경 감지 메서드 오버라이드
    onWorkspaceChanged(workspaceData) {
      console.log('Home: 워크스페이스 변경됨', workspaceData);
      
      // 홈 페이지에서 필요한 데이터 새로고침 로직
      // 예: 사용자 대시보드 데이터, 최근 활동 등
      this.refreshHomeData();
    },
    
    refreshHomeData() {
      // 홈 페이지 데이터 새로고침 로직
      console.log('홈 페이지 데이터 새로고침');
    }
  }
};
</script>

