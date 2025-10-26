<template>
  <div class="simple-milestone-container">
    <div class="milestone-controls">
      <button class="add-stone-btn" @click="addStone">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 0V18M0 9H18" stroke="#B5B5B5" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>스톤 생성</span>
      </button>
    </div>
    
    <div class="milestone-canvas" ref="canvasRef">
      
      <!-- 연결선들 -->
      <svg class="connection-lines" :width="canvasWidth" :height="canvasHeight">
        <g v-for="connection in connections" :key="connection.id">
          <!-- 연결선 -->
          <line 
            :x1="connection.x1" 
            :y1="connection.y1" 
            :x2="connection.x2" 
            :y2="connection.y2"
            :stroke="connection.isFromRoot ? '#FF8C00' : '#FFDD44'"
            :stroke-width="connection.isFromRoot ? '2' : '1'"
            :opacity="connection.isFromRoot ? '0.8' : '0.6'"
          />
        </g>
      </svg>
      
      <!-- 스톤 노드들 -->
      <div 
        v-for="stone in stoneNodes" 
        :key="stone.id"
        :class="['stone-node', { 'root-stone': stone.isRoot }]"
        :style="{ 
          left: stone.x + 'px', 
          top: stone.y + 'px'
        }"
        @click="onStoneClick(stone)"
      >
        <!-- 루트 스톤 특별 효과 -->
        <div v-if="stone.isRoot" class="root-stone-glow"></div>
        
        <!-- 스톤 내용 (중앙) -->
        <div class="stone-content">
          <!-- 스톤 이름 -->
          <div class="stone-name">{{ stone.name }}</div>
          
          <!-- D-Day 표시 -->
          <div v-if="stone.dDay" class="dday-display">
            {{ stone.dDay }}
          </div>
        </div>
        
        <!-- 루트 스톤 아이콘 -->
        <div v-if="stone.isRoot" class="root-stone-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#1C0F0F"/>
            <path d="M12 6L12.5 8.5L15 9L12.5 9.5L12 12L11.5 9.5L9 9L11.5 8.5L12 6Z" fill="#FFDD44"/>
          </svg>
        </div>
        
        <!-- 마일스톤 배지 -->
        <div v-if="stone.milestone" class="milestone-badge">
          {{ stone.milestone }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// Props
const props = defineProps({
  stones: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['edit-stone', 'delete-stone', 'add-stone'])

// Reactive data
const canvasRef = ref(null)
const canvasWidth = ref(1500)
const canvasHeight = ref(1000)
const stoneNodes = ref([])
const connections = ref([])
const zoomLevel = ref(1)
const zoomMin = 0.5
const zoomMax = 2

// Computed
const stoneNodesWithPositions = computed(() => {
  return stoneNodes.value.map(stone => ({
    ...stone,
    x: stone.x || 0,
    y: stone.y || 0
  }))
})

// Methods
const calculateDDay = (endTime) => {
  if (!endTime) return null
  
  const endDate = new Date(endTime)
  const today = new Date()
  
  // 시간을 00:00:00으로 설정하여 날짜만 비교
  today.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  
  const diffTime = endDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays > 0) {
    return `D-${diffDays}`
  } else if (diffDays === 0) {
    return 'D-Day'
  } else {
    return `D+${Math.abs(diffDays)}`
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return `${month}/${day}`
}

const convertStonesToNodes = (stones, parentId = null, level = 0) => {
  const nodes = []
  
  stones.forEach((stone, index) => {
    const nodeId = stone.stoneId || `stone-${Date.now()}-${index}`
    const position = calculateNodePosition(level, index, stones.length)
    
    const node = {
      id: nodeId,
      name: stone.stoneName,
      milestone: stone.milestone,
      startTime: stone.startTime,
      endTime: stone.endTime,
      dDay: calculateDDay(stone.endTime),
      stoneId: stone.stoneId,
      isRoot: level === 0,
      x: position.x,
      y: position.y,
      level: level,
      parentId: parentId
    }
    
    nodes.push(node)
    
    // 자식 노드들 재귀 처리
    if (stone.childStone && stone.childStone.length > 0) {
      const childNodes = convertStonesToNodes(stone.childStone, nodeId, level + 1)
      nodes.push(...childNodes)
    }
  })
  
  return nodes
}

const calculateNodePosition = (level, index, totalCount) => {
  // 캔버스 중앙을 기준으로 계산
  const canvasCenterX = canvasWidth.value / 2
  const canvasCenterY = canvasHeight.value / 2
  
  if (level === 0) {
    // 루트 레벨: 캔버스 중앙 상단에 배치
    return {
      x: canvasCenterX - 90, // 루트 스톤 크기(180px)의 절반만큼 왼쪽으로
      y: Math.max(50, canvasCenterY - 250) // 더 위쪽에 배치
    }
  } else {
    // 자식 레벨: 부모 아래에 가운데 정렬로 배치
    const nodeSpacing = Math.min(300, canvasWidth.value / (totalCount + 1)) // 화면 크기에 맞게 조정
    const startX = canvasCenterX - ((totalCount - 1) * nodeSpacing) / 2 - 75 // 자식 스톤 크기(150px)의 절반
    return {
      x: Math.max(75, Math.min(startX + (index * nodeSpacing), canvasWidth.value - 225)), // 화면 경계 내에 배치
      y: Math.min(canvasCenterY + 50, canvasHeight.value - 225) // 부모 아래에 배치하되 화면 밖으로 나가지 않도록
    }
  }
}

const updateConnections = () => {
  connections.value = []
  
  stoneNodes.value.forEach(node => {
    // 자식 노드들과의 연결선 계산
    const childNodes = stoneNodes.value.filter(n => n.parentId === node.id)
    childNodes.forEach(child => {
      // 루트 스톤과 일반 스톤의 중심점 계산
      const parentCenterX = node.x + (node.isRoot ? 90 : 75)
      const parentCenterY = node.y + (node.isRoot ? 90 : 75)
      const childCenterX = child.x + 75
      const childCenterY = child.y + 75
      
      const connection = {
        id: `conn-${node.id}-${child.id}`,
        x1: parentCenterX,
        y1: parentCenterY,
        x2: childCenterX,
        y2: childCenterY,
        isFromRoot: node.isRoot
      }
      connections.value.push(connection)
    })
  })
  
  console.log('연결선 업데이트됨:', connections.value.length, '개')
  console.log('연결선 상세:', connections.value)
}

const onStoneClick = (stone) => {
  console.log('스톤 클릭:', stone)
  emit('edit-stone', stone)
}

const addStone = () => {
  const newStone = {
    id: `new-stone-${Date.now()}`,
    name: '새 스톤',
    milestone: null,
    startTime: null,
    endTime: null,
    stoneId: `new-stone-${Date.now()}`,
    isRoot: false,
    x: 200,
    y: 200
  }
  
  stoneNodes.value.push(newStone)
  emit('add-stone', newStone)
}

// 확대/축소 함수들
const zoomIn = () => {
  if (zoomLevel.value < zoomMax) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, zoomMax)
    applyZoom()
  }
}

const zoomOut = () => {
  if (zoomLevel.value > zoomMin) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, zoomMin)
    applyZoom()
  }
}

const applyZoom = (level = null) => {
  console.log('SimpleMilestoneView applyZoom 호출됨, level:', level);
  if (level !== null) {
    zoomLevel.value = level
    console.log('zoomLevel 업데이트됨:', zoomLevel.value);
  }
  if (canvasRef.value) {
    canvasRef.value.style.transform = `scale(${zoomLevel.value})`
    canvasRef.value.style.transformOrigin = 'center center'
    console.log('캔버스 transform 적용됨:', `scale(${zoomLevel.value})`);
  } else {
    console.log('canvasRef가 없음');
  }
}

// 외부에서 호출할 수 있도록 expose
defineExpose({
  applyZoom
})

// Watchers
watch(() => props.stones, (newStones) => {
  console.log('SimpleMilestoneView - stones 변경됨:', newStones)
  if (newStones && newStones.length > 0) {
    console.log('SimpleMilestoneView - 스톤 데이터 처리 중...')
    console.log('SimpleMilestoneView - 원본 스톤 데이터:', JSON.stringify(newStones, null, 2))
    
    const nodes = convertStonesToNodes(newStones)
    stoneNodes.value = nodes
    console.log('SimpleMilestoneView - 노드 개수:', stoneNodes.value.length)
    console.log('SimpleMilestoneView - 노드 데이터:', stoneNodes.value)
    
    // 연결선 업데이트
    nextTick(() => {
      updateConnections()
    })
  } else {
    console.log('SimpleMilestoneView - 스톤 데이터가 없어서 테스트 데이터 사용')
    // 테스트용 기본 노드들 (동적 위치 계산)
    const testStones = [
      {
        stoneId: "pjt_s_1",
        stoneName: "3번째 프로젝트",
        startTime: "2025-10-15T09:00:00",
        endTime: "2025-11-15T18:00:00",
        parentStoneId: null,
        childStone: [
          {
            stoneId: "pjt_s_2",
            stoneName: "백엔드5 수정 스톤",
            startTime: "2025-10-16T09:00:00",
            endTime: "2025-10-20T18:00:00",
            parentStoneId: "pjt_s_1",
            childStone: [],
            milestone: null
          }
        ],
        milestone: null
      }
    ]
    
    const nodes = convertStonesToNodes(testStones)
    stoneNodes.value = nodes
    
    // 연결선 업데이트
    nextTick(() => {
      updateConnections()
    })
  }
}, { immediate: true, deep: true })

// Lifecycle
onMounted(() => {
  nextTick(() => {
    updateCanvasSize()
  })
})

// 캔버스 크기 업데이트 함수
const updateCanvasSize = () => {
  if (canvasRef.value) {
    // 캔버스 자체 크기를 사용하되, 최소 크기 보장
    const rect = canvasRef.value.getBoundingClientRect()
    canvasWidth.value = Math.max(rect.width || 950, 800)
    canvasHeight.value = Math.max(rect.height || 600, 500)
    console.log('SimpleMilestoneView - 캔버스 크기:', canvasWidth.value, 'x', canvasHeight.value)
    
    // 캔버스 크기가 변경되면 스톤 위치도 다시 계산
    if (stoneNodes.value.length > 0) {
      const nodes = convertStonesToNodes(props.stones || [])
      stoneNodes.value = nodes
      nextTick(() => {
        updateConnections()
      })
    }
  }
}

// 윈도우 리사이즈 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener('resize', updateCanvasSize)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<style scoped>
.simple-milestone-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fffdf7;
  background-image: radial-gradient(circle, rgba(217, 217, 217, 0.5) 1px, transparent 1px);
  background-size: 20px 20px;
  background-repeat: repeat;
  overflow: hidden;
}

.milestone-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.add-stone-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #2A2828;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
  color: #FFFFFF;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
}

.add-stone-btn:hover {
  background: #1a1818;
}

.milestone-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  min-height: 500px;
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.stone-node {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 10px solid #FFDD44;
  background: #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

/* 루트 스톤 특별 스타일 */
.root-stone {
  width: 180px;
  height: 180px;
  border: 15px solid #FF8C00;
  background: #FFFFFF;
  box-shadow: 
    0 12px 35px rgba(255, 140, 0, 0.5),
    0 0 0 12px rgba(255, 221, 68, 0.2),
    0 0 0 20px rgba(255, 140, 0, 0.1);
  position: relative;
  overflow: visible;
}

.root-stone::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFDD44, #FFB800, #FF8C00, #FFDD44);
  z-index: -1;
}

.stone-node:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.root-stone:hover {
  transform: scale(1.05);
  box-shadow: 
    0 12px 35px rgba(255, 221, 68, 0.6),
    0 0 0 12px rgba(255, 221, 68, 0.15),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

.stone-content {
  text-align: center;
  padding: 8px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2px;
}

.stone-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 18px;
  color: #1C0F0F;
  word-break: break-word;
  text-align: center;
  margin: 0;
  z-index: 3;
  max-width: 120px;
}

.root-stone .stone-name {
  font-size: 18px;
  font-weight: 800;
  line-height: 20px;
  max-width: 140px;
}


.milestone-badge {
  background: #2A2828;
  color: #FFFFFF;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
}



/* 루트 스톤 특별 요소들 */
.root-stone-glow {
  position: absolute;
  top: -30px;
  left: -30px;
  right: -30px;
  bottom: -30px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, rgba(255, 221, 68, 0.2) 50%, transparent 80%);
  z-index: -2;
}

.root-stone-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 6;
}


/* D-Day 표시 스타일 */
.dday-display {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #1C0F0F;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  z-index: 15;
  pointer-events: none;
  margin: 0;
}

.root-stone .dday-display {
  font-size: 18px;
  font-weight: 900;
  color: #1C0F0F;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.9);
}

</style>
