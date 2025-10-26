<template>
  <div v-if="isOpen" class="project-modal-container">
      <div class="project-modal-content">
        <h2 class="modal-title">프로젝트 생성</h2>
        
        <div class="form-section">
          <div class="form-field">
            <label class="form-label">프로젝트명 <span class="required">*</span></label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="form-input"
              placeholder="프로젝트명을 입력하세요"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">기간 <span class="required">*</span></label>
            <div class="date-input-group">
              <input 
                v-model="formData.startDate" 
                type="date" 
                class="form-input date-input"
              />
              <span class="calendar-icon">📅</span>
            </div>
          </div>
          
          <div class="form-field">
            <label class="form-label">담당자 <span class="required">*</span></label>
            <input 
              v-model="formData.manager" 
              type="text" 
              class="form-input"
              placeholder="담당자를 입력하세요"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">프로젝트 설명</label>
            <textarea 
              v-model="formData.description" 
              class="form-textarea"
              placeholder="프로젝트 설명을 입력하세요"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-field">
            <label class="form-label">채팅방 생성</label>
            <div class="checkbox-group">
              <input 
                v-model="formData.createChat" 
                type="checkbox" 
                class="checkbox-input"
                id="createChat"
              />
              <label for="createChat" class="checkbox-label">프로젝트와 함께 채팅방 생성</label>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-create" @click="handleCreate">
            프로젝트 추가
          </button>
        </div>
        
        <div class="modal-close" @click="closeModal">✕</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'CreateProjectModal',
  props: {
    modelValue: Boolean
  },
  data() {
    return {
      formData: {
        name: '',
        startDate: '',
        manager: '',
        description: '',
        createChat: false
      }
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  mounted() {
    window.addEventListener('openCreateProjectModal', this.openModal);
  },
  beforeUnmount() {
    window.removeEventListener('openCreateProjectModal', this.openModal);
  },
  methods: {
    openModal() {
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        name: '',
        startDate: '',
        manager: '',
        description: '',
        createChat: false
      };
    },
    handleCreate() {
      console.log('프로젝트 생성:', this.formData);
      // TODO: API 호출
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.project-modal-container {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.project-modal-content {
  background: #F5F5F5;
  border: 1px solid #000000;
  box-shadow: 4px 4px 32px rgba(0, 0, 0, 0.25), -4px -4px 32px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 40px 50px;
  width: 764px;
  max-height: 718px;
  overflow-y: auto;
  position: relative;
}

.modal-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 28px;
  line-height: 33px;
  color: #1C0F0F;
  margin-bottom: 30px;
  text-align: center;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #7C7C7C;
}

.required {
  color: #F4CE53;
}

.form-input {
  width: 100%;
  height: 56px;
  background: #FFFFFF;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  border: none;
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  min-height: 96px;
  background: #FFFFFF;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  border: none;
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  resize: vertical;
  box-sizing: border-box;
}

.date-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input {
  padding-right: 50px;
}

.calendar-icon {
  position: absolute;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox-input {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.checkbox-label {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #7C7C7C;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.btn-create {
  width: 142px;
  height: 42px;
  background: #2A2828;
  border-radius: 8px;
  border: none;
  color: #F5F5F5;
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-create:hover {
  background: #1a1818;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #000;
}
</style>
