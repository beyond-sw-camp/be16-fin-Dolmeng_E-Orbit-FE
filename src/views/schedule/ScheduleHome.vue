<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import MilestoneCard from "@/components/schedule/MilestoneCard.vue";
import TaskList from "@/components/schedule/TaskList.vue";
// import PersonalTodo from "@/components/schedule/PersonalTodo.vue";
import Todo from "@/components/schedule/TodoCard.vue";
import { useScheduleStore } from "@/stores/schedule";

const store = useScheduleStore();
const workspaceId = localStorage.getItem("workspaceId") || "";
store.setWorkspace(workspaceId);

onMounted(async () => {
  await store.loadMilestones();
});

const today = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
});

const activeIdx = ref(0);
const activeMilestone = computed(() => store.milestones[activeIdx.value]);

function nextMs() {
  if (activeIdx.value < store.milestones.length - 1) activeIdx.value++;
}
function prevMs() {
  if (activeIdx.value > 0) activeIdx.value--;
}
</script>

<template>
  <div class="wrap">
    <div class="today">
      <span>Today</span>
      <strong>{{ today }}</strong>
    </div>

    <!-- ✅ 2x2 카드 레이아웃 -->
    <div class="grid">
      <!-- 🟡 마일스톤 카드 -->
      <div class="card milestone">
        <div class="nav">
          <button @click="prevMs">◀</button>
          <div class="spacer"></div>
          <button @click="nextMs">▶</button>
        </div>

        <MilestoneCard
          v-if="activeMilestone"
          :name="activeMilestone.name"
          :dday="activeMilestone.dday"
          :progress="activeMilestone.progress"
        />
        <div v-else class="empty">진행 중인 마일스톤이 없습니다.</div>
      </div>

      <!-- 개인 To-Do -->
      <div class="card todo">
        <Todo :items="store.todos" @toggle="store.toggleTodo" />
      </div>

      <!-- Task -->
      <div class="card task">
        <TaskList :items="store.tasks" @toggle="store.toggleTask" />
      </div>

      <!-- 추가 기능 -->
      <div class="card summary">
        <div class="personal schedule">개인 일정</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.wrap {
  padding: 20px 32px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

/* 상단 탭 */
.tabs {
  display: flex;
  gap: 14px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
.tab {
  border: none;
  background: none;
  padding: 8px 14px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
}
.tab.active {
  color: #111;
  border-bottom: 2px solid #111;
}

/* 날짜 표시 */
.today {
  color: #666;
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 10px 0 24px;
}
.today strong {
  font-size: 18px;
  color: #000;
}

/* ✅ 2x2 고정형 카드 그리드 */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 두 개씩 균등 배치 */
  grid-auto-rows: 340px; /* 각 카드의 고정 높이 */
  gap: 28px; /* 카드 간 간격 */
  justify-content: center;
  align-items: stretch;
}

/* ✅ 카드 스타일 */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  /* 고정 크기 보정 */
  min-height: 340px;
  max-height: 340px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* ✅ hover 시 살짝 뜨는 효과 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

/* ✅ 반응형 (태블릿 이하일 때 1열로 전환) */
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 320px;
  }
}

/* 카드 내용이 없을 때 */
.empty {
  color: #888;
  font-weight: 500;
  font-size: 15px;
}

/* 네비게이션 버튼 */
.nav {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
}
.nav .spacer {
  flex: 1;
}
.nav button {
  border: none;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* ✅ 반응형 */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
