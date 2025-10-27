// 워크스페이스 변경 감지를 위한 믹스인
export const workspaceWatcher = {
  data() {
    return {
      workspaceChangeListener: null
    };
  },
  
  mounted() {
    // 워크스페이스 변경 이벤트 리스너 등록
    this.workspaceChangeListener = (event) => {
      this.onWorkspaceChanged(event.detail);
    };
    window.addEventListener('workspaceChanged', this.workspaceChangeListener);
  },
  
  beforeUnmount() {
    // 이벤트 리스너 제거
    if (this.workspaceChangeListener) {
      window.removeEventListener('workspaceChanged', this.workspaceChangeListener);
    }
  },
  
  methods: {
    // 워크스페이스 변경 시 호출되는 메서드 (컴포넌트에서 오버라이드)
    onWorkspaceChanged(workspaceData) {
      console.log('워크스페이스 변경 감지:', workspaceData);
      // 각 컴포넌트에서 이 메서드를 오버라이드하여 필요한 로직 구현
    }
  }
};
