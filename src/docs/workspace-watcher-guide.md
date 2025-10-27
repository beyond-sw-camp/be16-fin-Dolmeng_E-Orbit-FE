# 워크스페이스 변경 감지 시스템 사용 가이드

## 개요
모든 서비스에서 워크스페이스 변경 시 즉시 반영되도록 하는 전역 워크스페이스 변경 감지 시스템입니다.

## 시스템 구조

### 1. 워크스페이스 스토어 (`src/stores/workspace.js`)
- 워크스페이스 변경 시 자동으로 `workspaceChanged` 이벤트 발생
- 전역 이벤트 시스템을 통해 모든 컴포넌트에 알림

### 2. 워크스페이스 감지 믹스인 (`src/mixins/workspaceWatcher.js`)
- 모든 컴포넌트에서 쉽게 워크스페이스 변경을 감지할 수 있는 믹스인
- 자동으로 이벤트 리스너 등록/해제

### 3. 유틸리티 함수 (`src/utils/workspaceUtils.js`)
- 워크스페이스 변경 감지를 위한 헬퍼 함수들
- 다양한 방식으로 워크스페이스 변경 감지 구현 가능

## 사용 방법

### 방법 1: 믹스인 사용 (권장)

```javascript
// 컴포넌트에서 믹스인 import
import { workspaceWatcher } from '@/mixins/workspaceWatcher';

export default {
  name: "MyComponent",
  mixins: [workspaceWatcher],
  
  methods: {
    // 워크스페이스 변경 시 호출되는 메서드 오버라이드
    onWorkspaceChanged(workspaceData) {
      console.log('워크스페이스 변경됨:', workspaceData);
      
      // 필요한 데이터 새로고침 로직
      this.refreshData();
    },
    
    refreshData() {
      // 데이터 새로고침 로직
    }
  }
};
```

### 방법 2: 유틸리티 함수 사용

```javascript
import { addWorkspaceChangeListener } from '@/utils/workspaceUtils';

export default {
  name: "MyComponent",
  
  mounted() {
    // 워크스페이스 변경 리스너 등록
    this.removeListener = addWorkspaceChangeListener((workspaceData) => {
      console.log('워크스페이스 변경됨:', workspaceData);
      this.refreshData();
    });
  },
  
  beforeUnmount() {
    // 리스너 제거
    if (this.removeListener) {
      this.removeListener();
    }
  }
};
```

### 방법 3: 데코레이터 패턴 사용

```javascript
import { withWorkspaceWatcher } from '@/utils/workspaceUtils';

const MyComponent = {
  name: "MyComponent",
  // 컴포넌트 로직
};

// 워크스페이스 감지 기능 추가
export default withWorkspaceWatcher(MyComponent, function(workspaceData) {
  console.log('워크스페이스 변경됨:', workspaceData);
  this.refreshData();
});
```

## 워크스페이스 데이터 구조

```javascript
{
  newWorkspace: {
    workspaceId: "ws_1",
    workspaceName: "첫 번째 워크스페이스",
    role: "ADMIN"
  },
  oldWorkspace: {
    workspaceId: "ws_2", 
    workspaceName: "두 번째 워크스페이스",
    role: "MEMBER"
  },
  workspaceId: "ws_1",
  workspaceName: "첫 번째 워크스페이스",
  role: "ADMIN"
}
```

## 적용된 컴포넌트들

### 1. AdminDashboard.vue
- 권한 그룹 탭: 워크스페이스 변경 시 권한 그룹 목록 새로고침
- 워크스페이스 관리 탭: 워크스페이스 상세 정보 새로고침

### 2. SideBarComponent.vue
- 워크스페이스 변경 시 스토리지 사용량 정보 새로고침

### 3. Home.vue
- 워크스페이스 변경 시 홈 페이지 데이터 새로고침

## 새로운 컴포넌트에 적용하기

1. **믹스인 import**:
```javascript
import { workspaceWatcher } from '@/mixins/workspaceWatcher';
```

2. **믹스인 적용**:
```javascript
export default {
  mixins: [workspaceWatcher],
  // 컴포넌트 로직
};
```

3. **워크스페이스 변경 감지 메서드 구현**:
```javascript
methods: {
  onWorkspaceChanged(workspaceData) {
    // 워크스페이스 변경 시 실행할 로직
    this.refreshData();
  }
}
```

## 장점

1. **전역 감지**: 모든 컴포넌트에서 워크스페이스 변경을 자동으로 감지
2. **자동 관리**: 이벤트 리스너 등록/해제 자동화
3. **유연성**: 다양한 방식으로 워크스페이스 변경 감지 구현 가능
4. **성능**: 불필요한 API 호출 방지 및 효율적인 데이터 관리
5. **일관성**: 모든 컴포넌트에서 동일한 방식으로 워크스페이스 변경 처리

## 주의사항

1. **메모리 누수 방지**: 컴포넌트 해제 시 이벤트 리스너 제거 필수
2. **API 호출 최적화**: 워크스페이스 변경 시 필요한 데이터만 새로고침
3. **에러 처리**: API 호출 실패 시 적절한 에러 처리 구현
