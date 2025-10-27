<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card class="delete-workspace-modal">
      <!-- 모달 헤더 -->
      <v-card-title class="modal-header">
        <div class="warning-icon">
          <v-icon color="error" size="24">mdi-alert-circle</v-icon>
        </div>
        <span class="modal-title">워크스페이스 삭제</span>
      </v-card-title>

      <!-- 모달 내용 -->
      <v-card-text class="modal-content">
        <div class="warning-text">
          <p class="warning-message">이 작업은 되돌릴 수 없습니다.</p>
          <p class="description">워크스페이스와 관련된 모든 데이터가 영구적으로 삭제됩니다.</p>
        </div>

        <!-- 워크스페이스명 입력 -->
        <div class="input-section">
          <label class="input-label">* 워크스페이스명을 정확하게 입력하세요</label>
          <div class="workspace-name-display">
            <span class="workspace-name-text">{{ workspaceName }}</span>
          </div>
          <v-text-field
            v-model="workspaceNameInput"
            placeholder="워크스페이스명을 입력하세요"
            variant="outlined"
            density="compact"
            class="workspace-name-input"
            :error="nameError"
            :error-messages="nameError ? '워크스페이스명이 일치하지 않습니다.' : ''"
          />
        </div>
      </v-card-text>

      <!-- 모달 액션 버튼 -->
      <v-card-actions class="modal-actions">
        <v-btn
          @click="cancel"
          variant="outlined"
          color="grey"
          class="cancel-btn"
        >
          취소
        </v-btn>
        <v-btn
          @click="confirmDelete"
          color="error"
          class="delete-btn"
          :disabled="!isDeleteEnabled"
          :loading="loading"
        >
          삭제
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteWorkspaceModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    workspaceName: {
      type: String,
      required: true
    },
    workspaceId: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'confirm-delete'],
  data() {
    return {
      workspaceNameInput: '',
      nameError: false,
      loading: false
    };
  },
  computed: {
    dialog: {
      get() {
        console.log('DeleteWorkspaceModal dialog get:', this.modelValue);
        return this.modelValue;
      },
      set(value) {
        console.log('DeleteWorkspaceModal dialog set:', value);
        this.$emit('update:modelValue', value);
      }
    },
    isDeleteEnabled() {
      return this.workspaceNameInput === this.workspaceName && this.workspaceNameInput.length > 0;
    }
  },
  watch: {
    workspaceNameInput(newValue) {
      if (newValue && newValue !== this.workspaceName) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }
    },
    dialog(newValue) {
      if (!newValue) {
        this.resetForm();
      }
    }
  },
  mounted() {
    console.log('DeleteWorkspaceModal mounted');
    console.log('props:', {
      modelValue: this.modelValue,
      workspaceName: this.workspaceName,
      workspaceId: this.workspaceId
    });
  },
  methods: {
    resetForm() {
      this.workspaceNameInput = '';
      this.nameError = false;
      this.loading = false;
    },
    cancel() {
      this.dialog = false;
    },
    async confirmDelete() {
      if (!this.isDeleteEnabled) {
        return;
      }

      this.loading = true;
      try {
        await this.$emit('confirm-delete', {
          workspaceId: this.workspaceId,
          workspaceName: this.workspaceName
        });
        this.dialog = false;
      } catch (error) {
        console.error('워크스페이스 삭제 실패:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.delete-workspace-modal {
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
}

.warning-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #ff6b6b;
  border-radius: 50%;
  border: 3px solid #fff;
}

.modal-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: #1c0f0f;
}

.modal-content {
  padding: 16px 24px 24px 24px;
}

.warning-text {
  margin-bottom: 24px;
}

.warning-message {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #666666;
  margin: 0 0 8px 0;
  text-align: center;
}

.description {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #666666;
  margin: 0;
  text-align: center;
}

.input-section {
  margin-top: 16px;
}

.input-label {
  display: block;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #ff6b6b;
  margin-bottom: 8px;
}

.workspace-name-display {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 12px;
  text-align: center;
}

.workspace-name-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #1c0f0f;
}

.workspace-name-input {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.workspace-name-input :deep(.v-field__input) {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #1c0f0f;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px 24px 24px;
}

.cancel-btn {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #666666;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  min-width: 80px;
}

.delete-btn {
  background-color: #ff6b6b;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  min-width: 80px;
}

.delete-btn:disabled {
  background-color: #e9ecef;
  color: #666666;
}

/* 다이얼로그 오버레이 */
:deep(.v-overlay__content) {
  border-radius: 8px;
}
</style>
