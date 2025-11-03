<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <div class="icon-title">
          <span class="icon">📅</span>
          <h3>일정 상세 정보</h3>
        </div>
      </div>

      <div class="modal-body" v-if="schedule">
        <!-- 일정명 -->
        <label class="field-label">일정명</label>
        <input class="field-input" v-model="editForm.calendarName" />

        <!-- 작성자 -->
        <p class="readonly"><strong>작성자:</strong> {{ schedule.userName || "-" }}</p>

        <!-- 시작일 -->
        <label class="field-label">시작일</label>
        <input class="field-input" type="datetime-local" v-model="editForm.startedAt" />

        <!-- 종료일 -->
        <label class="field-label">종료일</label>
        <input class="field-input" type="datetime-local" v-model="editForm.endedAt" />

        <!-- 일정 공개 여부 -->
        <div class="share-row">
          <label class="field-label">일정 공개 여부</label>
          <input id="shared" type="checkbox" v-model="editForm.isShared" class="checkbox" />
        </div>
      </div>

      <div v-else class="loading">⏳ 일정 정보를 불러오는 중...</div>

      <div class="modal-footer">
        <button
          class="btn-edit"
          v-if="schedule?.userId === userId"
          @click="updateSchedule"
        >
          수정
        </button>
        <button
          class="btn-delete"
          v-if="schedule?.userId === userId"
          @click="deleteSchedule"
        >
          삭제
        </button>
        <button class="btn-close" @click="close">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  visible: Boolean,
  eventId: String,
});
const emit = defineEmits(["update:visible", "updated", "deleted"]);

const userId = localStorage.getItem("id");
const workspaceId = localStorage.getItem("selectedWorkspaceId");

const schedule = ref(null);
const editForm = ref({});

// 일정 정보 불러오기
watch(
  () => props.eventId,
  async (newId) => {
    if (!newId) return;
    try {
      const { data } = await axios.get(
        `/user-service/shared-calendars/detail/${newId}?workspaceId=${workspaceId}`,
        {
          headers: { "X-User-Id": userId },
        }
      );
      schedule.value = data.result || data;

      editForm.value = {
        calendarName: schedule.value.calendarName,
        startedAt: schedule.value.startedAt?.slice(0, 16),
        endedAt: schedule.value.endedAt?.slice(0, 16),
        isShared: schedule.value.isShared,
      };
    } catch (err) {
      console.error("❌ 일정 조회 실패:", err);
      alert(err.response?.data?.statusMessage || "일정 정보를 불러오지 못했습니다.");
    }
  },
  { immediate: true }
);

// 수정 저장
const updateSchedule = async () => {
  try {
    await axios.put(
      `/user-service/shared-calendars/${props.eventId}?workspaceId=${workspaceId}`,
      {
        calendarName: editForm.value.calendarName,
        startedAt: editForm.value.startedAt,
        endedAt: editForm.value.endedAt,
        isShared: editForm.value.isShared,
      },
      {
        headers: { "X-User-Id": userId },
      }
    );
    alert("✅ 일정이 수정되었습니다.");
    emit("updated");
  } catch (err) {
    console.error("❌ 일정 수정 실패:", err);
    alert("일정 수정 실패");
  }
};

// 일정 삭제
const deleteSchedule = async () => {
  if (!confirm("이 일정을 삭제하시겠습니까?")) return;
  try {
    await axios.delete(
      `/user-service/shared-calendars/${props.eventId}?workspaceId=${workspaceId}`,
      { headers: { "X-User-Id": userId } }
    );
    alert("🗑️ 일정이 삭제되었습니다.");
    emit("deleted");
    close();
  } catch (err) {
    console.error("❌ 일정 삭제 실패:", err);
    alert("일정 삭제 실패");
  }
};

const close = () => {
  emit("update:visible", false);
};
</script>

<style scoped>
/* ✅ 모달 전체 영역 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

/* ✅ 카드 스타일 모달 */
.modal-card {
  width: 420px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.25s ease-in-out;
}

/* ✅ 헤더 */
.modal-header {
  background: linear-gradient(135deg, #a5b4ff, #ffd580);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  color: #333;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 20px;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

/* ✅ 본문 */
.modal-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.field-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #a5b4ff;
  box-shadow: 0 0 0 2px rgba(165, 180, 255, 0.2);
}

.readonly {
  font-size: 14px;
  color: #666;
}

/* ✅ 공개 여부 한 줄 정렬 */
.share-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  margin-bottom: 8px;
}

.share-row .field-label {
  margin: 0;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #ffd580;
}

/* ✅ 푸터 버튼 영역 */
.modal-footer {
  padding: 14px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #fafafa;
  border-top: 1px solid #eee;
}

.btn-edit {
  background: #a5b4ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background: #8d9efc;
}

.btn-delete {
  background: #ff7777;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #ff5a5a;
}

.btn-close {
  background: #ddd;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #ccc;
}

/* ✅ 로딩 상태 */
.loading {
  text-align: center;
  padding: 24px;
  color: #666;
}

/* ✅ 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
