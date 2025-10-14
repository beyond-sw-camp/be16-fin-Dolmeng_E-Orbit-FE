<template>
  <div class="editor-container">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { connectStomp, sendStompMessage, disconnectStomp } from '../../services/editorStompService';
import axios from 'axios';

// 이 컴포넌트가 담당할 문서 ID (실제로는 props나 vue-router를 통해 동적으로 받아야 함)
const documentId = 'ws_fol_doc_1';
const isUpdatingFromRemote = ref(false); // 원격 업데이트 중인지 여부를 나타내는 플래그

const editor = useEditor({
  content: '<p>문서 내용을 여기에 입력하세요...</p>',
  extensions: [StarterKit],
  // 에디터 내용이 변경될 때마다 호출
  onUpdate: ({ editor, transaction }) => {
    // 원격에서 받은 변경사항으로 인해 update가 트리거된 경우, 다시 서버로 보내지 않도록 방지
    if (isUpdatingFromRemote.value) {
      return;
    }

    // 변경사항이 실제로 존재하고, 외부에서 발생한 변경이 아닐 경우
    if (transaction.docChanged && !transaction.getMeta('preventUpdate')) {
      const updateMessage = {
        type: 'UPDATE',
        documentId: documentId,
        senderId: 'local-user', // 실제로는 로그인된 사용자 ID를 사용
        content: editor.getJSON(), // TipTap의 내용을 JSON 형식으로 변환하여 전송
      };
      sendStompMessage(updateMessage);
    }
  },
});

// 서버로부터 메시지를 받았을 때 처리하는 함수
const handleIncomingMessage = (message) => {
  if (message.type === 'UPDATE' && editor.value) {
    // 업데이트 플래그를 true로 설정하여 onUpdate 이벤트에서 무한 루프 방지
    isUpdatingFromRemote.value = true;
    
    // 다른 사용자의 변경 내용을 현재 에디터에 적용
    // `setContent`는 커서를 처음으로 옮기므로, 트랜잭션을 사용하여 커서 위치를 유지하는 것이 더 좋음
    const { from, to } = editor.value.state.selection;
    editor.value.chain().setContent(message.content, false).setTextSelection({ from, to }).run();
    
    // 플래그를 다시 false로 설정
    isUpdatingFromRemote.value = false;
  }
};

onMounted(async () => {
  try {
    // 1. API 서버에서 문서 초기 내용 로드
    const response = await axios.get(`http://localhost:8080/drive-service/drive/document/${documentId}`);
    const initialContent = response.data;
    
    // 2. 에디터에 내용 설정
    if (editor.value) {
      editor.value.commands.setContent(initialContent, false);
    }

    // 3. STOMP 연결
    connectStomp(documentId, handleIncomingMessage);

  } catch (error) {
    console.error('문서 로딩 실패:', error);
  }
});
</script>

<style>
.editor-container .ProseMirror {
  border: 1px solid #ccc;
  padding: 1rem;
  min-height: 300px;
}
.ProseMirror:focus {
    outline: none;
}
</style>