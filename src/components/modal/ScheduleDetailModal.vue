<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h3>📅 일정 상세 정보</h3>

      <div v-if="!isEditing && schedule">
        <p><strong>일정명:</strong> {{ schedule.calendarName }}</p>
        <p><strong>작성자:</strong> {{ schedule.userName || "-" }}</p>
        <p><strong>시작일:</strong> {{ formatDate(schedule.startedAt) }}</p>
        <p><strong>종료일:</strong> {{ formatDate(schedule.endedAt) }}</p>
        <p><strong>공유 여부:</strong> {{ schedule.isShared ? "공개" : "비공개" }}</p>

        <div class="modal-actions">
          <button class="edit-btn" @click="startEdit">수정</button>
          <button class="delete-btn" @click="deleteSchedule">삭제</button>
          <button class="close-btn" @click="close">닫기</button>
        </div>
      </div>

      <!-- ✏️ 수정 모드 -->
      <div v-else-if="isEditing">
        <label>일정명</label>
        <input v-model="editForm.calendarName" />

        <label>시작일</label>
        <input type="datetime-local" v-model="editForm.startedAt" />

        <label>종료일</label>
        <input type="datetime-local" v-model="editForm.endedAt" />

        <label>
          <input type="checkbox" v-model="editForm.isShared" />
          공개 일정
        </label>

        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelEdit">취소</button>
          <button class="submit-btn" @click="updateSchedule">저장</button>
        </div>
      </div>

      <div v-else>
        <p>⏳ 일정 정보를 불러오는 중...</p>
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
const schedule = ref(null);
const isEditing = ref(false);
const editForm = ref({});

const workspaceId = localStorage.getItem("selectedWorkspaceId");

// 일정 정보 불러오기
watch(
  () => props.eventId,
  async (newId) => {
    if (!newId) return;

    console.log("🧭 eventId:", newId);
    console.log("🧭 workspaceId:", workspaceId); // ✅ 추가

    try {
      const { data } = await axios.get(
        `/user-service/shared-calendars/detail/${newId}?workspaceId=${workspaceId}`,
        {
          headers: { "X-User-Id": userId },
        }
      );
      schedule.value = data.result || data;
    } catch (err) {
      console.error("❌ 일정 조회 실패:", err);
      alert(err.response?.data?.statusMessage || "일정 정보를 불러오지 못했습니다.");
    }
  },
  { immediate: true }
);

// 일정 수정 시작
const startEdit = () => {
  isEditing.value = true;
  editForm.value = {
    calendarName: schedule.value.calendarName,
    startedAt: schedule.value.startedAt?.slice(0, 16),
    endedAt: schedule.value.endedAt?.slice(0, 16),
    isShared: schedule.value.isShared,
  };
};

// 일정 수정 취소
const cancelEdit = () => {
  isEditing.value = false;
};

// 일정 수정 저장
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
    isEditing.value = false;
    emit("updated"); // 부모 컴포넌트에서 fetchSharedData 실행
    close();
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
    {
      headers: { "X-User-Id": userId },
    });

    alert("🗑️ 일정이 삭제되었습니다.");
    emit("deleted"); // 부모에서 다시 렌더링
    close();
  } catch (err) {
    console.error("❌ 일정 삭제 실패:", err);
    alert("일정 삭제 실패");
  }
};

// 닫기
const close = () => {
  isEditing.value = false;
  emit("update:visible", false);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.2s ease-in-out;
}

.modal h3 {
  margin-bottom: 8px;
}

.modal p {
  margin: 4px 0;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.close-btn,
.cancel-btn {
  background: #ddd;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn {
  background: #a5b4ff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
}

.delete-btn {
  background: #ff7777;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  color: white;
  font-weight: 600;
}

.submit-btn {
  background: #ffd580;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
