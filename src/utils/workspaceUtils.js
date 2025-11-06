// 워크스페이스 관련 유틸리티 함수들

/**
 * 워크스페이스 변경 시 모든 컴포넌트에 알림을 보내는 전역 함수
 * @param {Object} workspaceData - 워크스페이스 데이터
 */
export const notifyWorkspaceChange = (workspaceData) => {
  const event = new CustomEvent('workspaceChanged', {
    detail: workspaceData
  });
  window.dispatchEvent(event);
};

/**
 * 워크스페이스 변경 이벤트 리스너를 등록하는 헬퍼 함수
 * @param {Function} callback - 워크스페이스 변경 시 호출될 콜백 함수
 * @returns {Function} - 이벤트 리스너 제거 함수
 */
export const addWorkspaceChangeListener = (callback) => {
  const listener = (event) => {
    callback(event.detail);
  };
  
  window.addEventListener('workspaceChanged', listener);
  
  // 리스너 제거 함수 반환
  return () => {
    window.removeEventListener('workspaceChanged', listener);
  };
};

/**
 * 워크스페이스 변경 감지를 위한 컴포넌트 믹스인 생성
 * @param {Function} onWorkspaceChanged - 워크스페이스 변경 시 호출될 메서드
 * @returns {Object} - Vue 컴포넌트 믹스인 객체
 */
export const createWorkspaceWatcher = (onWorkspaceChanged) => {
  return {
    data() {
      return {
        workspaceChangeListener: null
      };
    },
    
    mounted() {
      this.workspaceChangeListener = (event) => {
        if (typeof onWorkspaceChanged === 'function') {
          onWorkspaceChanged.call(this, event.detail);
        }
      };
      window.addEventListener('workspaceChanged', this.workspaceChangeListener);
    },
    
    beforeUnmount() {
      if (this.workspaceChangeListener) {
        window.removeEventListener('workspaceChanged', this.workspaceChangeListener);
      }
    }
  };
};

/**
 * 워크스페이스 변경 감지 데코레이터 (고차 함수)
 * @param {Object} component - Vue 컴포넌트 객체
 * @param {Function} onWorkspaceChanged - 워크스페이스 변경 시 호출될 메서드
 * @returns {Object} - 믹스인이 적용된 컴포넌트
 */
export const withWorkspaceWatcher = (component, onWorkspaceChanged) => {
  return {
    ...component,
    mixins: [
      ...(component.mixins || []),
      createWorkspaceWatcher(onWorkspaceChanged)
    ]
  };
};
