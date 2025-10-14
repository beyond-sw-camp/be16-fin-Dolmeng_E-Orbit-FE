<template>
  <div class="editor-wrapper">
    <!-- 연결 상태 표시 -->
    <div class="connection-status" :class="connectionStatusClass">
      <span v-if="connectionStatus === 'connecting'">🔄 서버 연결 중...</span>
      <span v-else-if="connectionStatus === 'connected'">✅ 실시간 협업 활성화</span>
      <span v-else-if="connectionStatus === 'offline'">⚠️ 오프라인 모드 (변경사항이 저장되지 않습니다)</span>
    </div>

    <!-- 에디터를 감싸는 컨테이너에 relative 포지션을 주어 커서 위치의 기준점으로 삼습니다. -->
    <div class="editor-container" ref="editorContainerRef">
      <editor-content v-if="editor" :editor="editor" />

    <!-- 다른 사용자들의 커서를 렌더링하는 부분 -->
    <div
      v-for="cursor in remoteCursors"
      :key="cursor.user.name"
      class="remote-cursor"
      :style="{
        transform: `translate(${cursor.coords.left}px, ${cursor.coords.top}px)`,
        backgroundColor: cursor.user.color,
        height: cursor.height ? `${cursor.height}px` : '1.3em'
      }"
    >
      <div class="cursor-flag" :style="{ backgroundColor: cursor.user.color }">
        {{ cursor.user.name }}
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { connectStomp, sendStompMessage, disconnectStomp } from '../../services/editorStompService';
import axios from 'axios';

// --- 상태 관리 ---
const documentId = 'ws_fol_doc_1';
const editorContainerRef = ref(null); // 에디터 컨테이너 DOM 참조
const isConnected = ref(false);
const isUpdatingFromRemote = ref(false);
const remoteCursorsMap = ref({}); // 다른 사용자 커서 정보 객체 { senderId: { user, pos } }
const lastCursorUpdate = ref(0); // 커서 업데이트 throttle용
const connectionStatus = ref('connecting'); // 'connecting' | 'connected' | 'offline'
let connectionTimeout = null;

const user = {
  name: 'User ' + Math.floor(Math.random() * 100),
  color: '#' + Math.floor(Math.random()*16777215).toString(16),
};

// 연결 상태에 따른 CSS 클래스
const connectionStatusClass = computed(() => ({
  'status-connecting': connectionStatus.value === 'connecting',
  'status-connected': connectionStatus.value === 'connected',
  'status-offline': connectionStatus.value === 'offline',
}));

// useEditor는 이미 ref를 반환하므로 직접 사용
const editor = useEditor({
  content: '<p>서버에 연결 중입니다...</p>',
  editable: false,
  extensions: [StarterKit],
  
  // 문서 내용 변경 시 서버로 전송
  onUpdate: ({ editor }) => {
    if (isUpdatingFromRemote.value || !isConnected.value) return;
    sendStompMessage({
      destination: '/publish/editor/update',
      body: {
        type: 'UPDATE',
        documentId,
        senderId: user.name,
        content: editor.getJSON(),
      },
    });
  },

  // 커서/선택 영역 변경 시 서버로 전송 (throttle 적용)
  onSelectionUpdate: ({ editor }) => {
    if (isUpdatingFromRemote.value || !isConnected.value) return;
    
    const now = Date.now();
    if (now - lastCursorUpdate.value < 100) return; // 100ms throttle
    lastCursorUpdate.value = now;
    
    sendStompMessage({
      destination: '/publish/editor/cursor',
      body: {
        type: 'CURSOR_UPDATE',
        documentId,
        senderId: user.name,
        content: { pos: editor.state.selection.from, user },
      },
    });
  },
});

// 커서 좌표 계산을 포함한 computed
const remoteCursors = computed(() => {
  if (!editor.value || !editor.value.view || !editorContainerRef.value) {
    return [];
  }

  const editorDom = editor.value.view.dom;
  if (!editorDom) return [];
  
  const containerRect = editorContainerRef.value.getBoundingClientRect();
  const cursors = [];

  // ProseMirror의 padding, border가 포함되어 좌표가 밀리는 것을 방지하기 위해 보정값을 계산합니다.
  const style = window.getComputedStyle(editorDom);
  const paddingLeft = parseFloat(style.paddingLeft || '0');
  const paddingTop = parseFloat(style.paddingTop || '0');
  const borderLeft = parseFloat(style.borderLeftWidth || '0');
  const borderTop = parseFloat(style.borderTopWidth || '0');

  for (const senderId in remoteCursorsMap.value) {
    const cursor = remoteCursorsMap.value[senderId];
    try {
      // 문서의 최대 길이를 넘지 않도록 체크 (빈 문서도 안전하게 처리)
      const maxPos = editor.value.state.doc.content.size;
      const safePos = Math.min(Math.max(cursor.pos, 0), maxPos);

      // viewport 기준 절대 좌표 { top, bottom, left, right }
      const coords = editor.value.view.coordsAtPos(safePos);

      // 커서 높이 = bottom - top
      const cursorHeight = coords.bottom - coords.top;

      // 컨테이너 기준으로 변환 + padding/border 보정
      const relativeLeft = coords.left - containerRect.left - paddingLeft - borderLeft;
      const relativeTop = coords.top - containerRect.top - paddingTop - borderTop;

      cursors.push({
        user: cursor.user,
        coords: {
          left: relativeLeft,
          top: relativeTop,
        },
        height: cursorHeight,
      });
    } catch (error) {
      // pos가 유효하지 않을 경우 무시
      console.warn('Invalid cursor position:', cursor.pos, error);
    }
  }

  return cursors;
});

// --- 메시지 수신 처리 ---
const handleIncomingMessage = (message) => {
  if (!editor.value) return;

  // 1. 문서 내용 업데이트 처리
  if (message.type === 'UPDATE' && message.senderId !== user.name) {
    isUpdatingFromRemote.value = true;
    const { from, to } = editor.value.state.selection;
    
    // JSON 형식으로 받아서 JSON으로 설정
    editor.value.chain()
      .setContent(message.content, false)
      .setTextSelection({ from, to })
      .run();
    
    isUpdatingFromRemote.value = false;
  }
  
  // 2. 커서 위치 업데이트 처리
  if (message.type === 'CURSOR_UPDATE' && message.senderId !== user.name) {
    remoteCursorsMap.value = {
      ...remoteCursorsMap.value,
      [message.senderId]: {
        user: message.content.user,
        pos: message.content.pos,
      }
    };
  }
};

// 에디터 활성화 함수
const enableEditor = (content = '<p>여기에 입력하세요...</p>', isOnline = false) => {
  if (!editor.value) return;
  
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
  
  editor.value.commands.setContent(content, false);
  editor.value.setOptions({ editable: true });
  nextTick(() => {
    editor.value?.commands.focus('end');
  });
  
  isConnected.value = isOnline;
  connectionStatus.value = isOnline ? 'connected' : 'offline';
  
  console.log(isOnline ? '✅ 온라인 모드로 에디터 활성화' : '⚠️ 오프라인 모드로 에디터 활성화');
};

// --- STOMP 연결 성공 시 콜백 ---
const onStompConnected = async () => {
  console.log('🔗 STOMP 연결 성공, 문서 로딩 시작...');
  
  try {
    // 1. API 서버에서 문서 초기 내용 로드
    const response = await axios.get(`http://localhost:8080/drive-service/drive/document/${documentId}`);
    
    console.log('📄 문서 로드 성공:', response.data);
    
    // 2. 에디터에 내용 설정
    const content = response.data.content || '<p>여기에 입력하세요...</p>';
    enableEditor(content, true);
    
  } catch (error) {
    console.error('❌ 문서 로딩 실패:', error);
    // 서버에서 문서를 못 가져와도 편집은 가능하도록
    enableEditor('<p>문서를 불러올 수 없습니다. 새로 작성합니다.</p>', false);
  }
};

// --- 컴포넌트 생명주기 ---
onMounted(() => {
  console.log('📝 에디터 마운트, 연결 시도 중...');
  
  // STOMP 연결 시작
  connectStomp(documentId, handleIncomingMessage, onStompConnected);
  
  // 3초 후에도 연결 안되면 오프라인 모드로 전환
  connectionTimeout = setTimeout(() => {
    if (!isConnected.value) {
      console.warn('⏱️ 연결 타임아웃 - 오프라인 모드로 전환');
      enableEditor('<p>여기에 입력하세요...</p>', false);
    }
  }, 3000);
});

onBeforeUnmount(() => {
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
  }
  disconnectStomp();
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 연결 상태 표시 */
.connection-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.status-connecting {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-connected {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-offline {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.editor-container {
  position: relative; /* 원격 커서 위치의 기준점 */
}

.ProseMirror {
  border: 1px solid #ccc;
  padding: 1rem;
  min-height: 300px;
  border-radius: 4px;
  background-color: white;
}

.ProseMirror:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* 원격 커서 스타일 */
.remote-cursor {
  position: absolute;
  pointer-events: none;
  width: 2px;
  z-index: 10;
  transform-origin: top left;
}

.cursor-flag {
  position: absolute;
  top: -1.5em;
  left: 2px;
  color: white;
  font-size: 0.75em;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  line-height: 1.2;
}
</style>
