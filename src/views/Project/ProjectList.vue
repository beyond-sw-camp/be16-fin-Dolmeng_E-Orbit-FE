<template>
  <div class="project-container">
    <!-- 프로젝트 헤더 (바디 안의 헤더) -->
    <div class="project-header">
      <div class="title-wrapper">
        <h1 class="project-title">{{ projectName }}</h1>
        <svg class="edit-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 1.5L12.5 3.5L11 5L9 3L10.5 1.5Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 3L11 5L4.5 11.5L1 13L2.5 9.5L9 3Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <!-- 프로젝트 정보 (제목 오른쪽) -->
      <div class="project-info">
        <div class="date-info">
          <svg class="calendar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#666666" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.6667 1.33333V4" stroke="#666666" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.33333 1.33333V4" stroke="#666666" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 6.66667H14" stroke="#666666" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="date-range">2025.09.12 - 2025.11.12</span>
        </div>
        <div class="project-owner">
          <svg class="user-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#666666"/>
            <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="#666666"/>
          </svg>
          <span class="owner-name">김을빗</span>
        </div>
      </div>
    </div>
    
    <!-- 프로젝트 설명 -->
    <div class="project-description-section">
      <p class="project-description-text">{{ projectDescription }}</p>
    </div>
    
    <!-- 탭 메뉴 -->
    <div class="tab-section">
      <div class="tab-menu">
        <div class="tab-item" :class="{ active: activeTab === 'milestone' }" @click="activeTab = 'milestone'">
          마일스톤
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
          대시보드
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'gantt' }" @click="activeTab = 'gantt'">
          간트차트
        </div>
        <div class="tab-item" :class="{ active: activeTab === 'documents' }" @click="activeTab = 'documents'">
          문서함
        </div>
      </div>
    </div>
    
    <!-- 마일스톤 탭 -->
    <div v-if="activeTab === 'milestone'">
      <!-- 마일스톤 캔버스 -->
      <div 
        class="milestone-canvas" 
        :class="{ panning: isPanning }"
        ref="milestoneCanvas"
      >
        <div v-if="loading" class="loading-container">
          <p class="loading-text">스톤 목록을 불러오는 중...</p>
        </div>
        <template v-else>
        <!-- SVG 캔버스 -->
        <svg 
          class="milestone-svg" 
          :width="canvasWidth" 
          :height="canvasHeight"
          @wheel="onWheel"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
        >
          <!-- 확대/축소 그룹 -->
          <g :transform="`translate(${translate.x}, ${translate.y}) scale(${scale})`">
        <!-- 연결선들 -->
          <g v-for="connection in connections" :key="connection.id">
            <line 
              :x1="connection.x1" 
              :y1="connection.y1" 
              :x2="connection.x2" 
              :y2="connection.y2"
              :stroke="connection.isFromRoot ? '#FF8C00' : '#FFDD44'"
                :stroke-width="connection.isFromRoot ? 2 : 1"
              :opacity="connection.isFromRoot ? '0.8' : '0.6'"
            />
          </g>
        
        <!-- 스톤 노드들 -->
            <g v-for="stone in stoneNodes" :key="stone.id" class="stone-group">
              <!-- 스톤 원형 배경 -->
              <circle
                :cx="stone.x + (stone.isRoot ? 90 : 75)"
                :cy="stone.y + (stone.isRoot ? 90 : 75)"
                :r="stone.isRoot ? 90 : 75"
                :fill="stone.isRoot ? 'url(#rootGradient)' : 'url(#childGradient)'"
                :stroke="stone.isRoot ? '#FF8C00' : '#FFDD44'"
                :stroke-width="stone.isRoot ? 3 : 2"
                class="stone-circle"
                @click="onStoneClick(stone)"
              />
              
              <!-- 스톤 텍스트 -->
              <text
                :x="stone.x + (stone.isRoot ? 90 : 75)"
                :y="stone.y + (stone.isRoot ? 90 : 75) - 10"
                text-anchor="middle"
                class="stone-name"
          @click="onStoneClick(stone)"
        >
                {{ stone.name }}
              </text>
              
              <!-- D-Day 텍스트 -->
              <text
                v-if="stone.dDay"
                :x="stone.x + (stone.isRoot ? 90 : 75)"
                :y="stone.y + (stone.isRoot ? 90 : 75) + 15"
                text-anchor="middle"
                class="stone-dday"
                @click="onStoneClick(stone)"
              >
              {{ stone.dDay }}
              </text>
          
          <!-- 마일스톤 배지 -->
              <g v-if="stone.milestone">
                <rect
                  :x="stone.x + (stone.isRoot ? 90 : 75) - 20"
                  :y="stone.y + (stone.isRoot ? 90 : 75) + 30"
                  width="40"
                  height="20"
                  fill="#FFDD44"
                  rx="10"
                />
                <text
                  :x="stone.x + (stone.isRoot ? 90 : 75)"
                  :y="stone.y + (stone.isRoot ? 90 : 75) + 42"
                  text-anchor="middle"
                  class="milestone-text"
                >
            {{ stone.milestone }}%
                </text>
              </g>
              
              <!-- 스톤 생성 텍스트 -->
              <text
                :x="stone.x + (stone.isRoot ? 90 : 75) + 80"
                :y="stone.y + (stone.isRoot ? 90 : 75) + 80"
                class="stone-create-text"
                @click="openCreateStoneModal(stone)"
              >
                스톤 생성
              </text>
            </g>
          </g>
          
          <!-- 그라데이션 정의 -->
          <defs>
            <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FF8C00;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="childGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FFDD44;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFE55C;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
        </template>
      </div>
    </div>
    
    <!-- 다른 탭들 -->
    <div v-else class="other-tabs">
      <p v-if="activeTab === 'dashboard'" class="placeholder-text">대시보드 컨텐츠</p>
      <p v-if="activeTab === 'gantt'" class="placeholder-text">간트차트 컨텐츠</p>
      <p v-if="activeTab === 'documents'" class="placeholder-text">문서함 컨텐츠</p>
    </div>
    
    <!-- 확대/축소 컨트롤 (ProjectList에 직접 추가) -->
    <div class="zoom-controls">
      <button class="zoom-btn zoom-in" @click="zoomIn" :disabled="zoomLevel >= zoomMax">+</button>
      <button class="zoom-btn zoom-out" @click="zoomOut" :disabled="zoomLevel <= zoomMin">-</button>
    </div>
    
    <!-- 스톤 생성 모달 -->
    <div v-if="showCreateStoneModal" class="modal-overlay" @click="closeCreateStoneModal">
      <div class="create-stone-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">스톤 생성</h2>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              상위스톤 <span class="required">*</span>
            </label>
            <div class="form-input-wrapper">
              <input 
                type="text" 
                class="form-input" 
                v-model="newStone.parentStoneName"
                readonly
                placeholder="상위 스톤"
              />
              <span class="dropdown-arrow">▼</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              스톤명 <span class="required">*</span>
            </label>
            <input 
              type="text" 
              class="form-input" 
              v-model="newStone.stoneName"
              placeholder="스톤명을 입력하세요"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">
              기간 <span class="required">*</span>
            </label>
            <div class="form-input-wrapper">
              <input 
                type="date" 
                class="form-input" 
                v-model="newStone.startTime"
                placeholder="시작일"
              />
              <span class="date-separator">~</span>
              <input 
                type="date" 
                class="form-input" 
                v-model="newStone.endTime"
                placeholder="종료일"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              담당자 <span class="required">*</span>
            </label>
            <input 
              type="text" 
              class="form-input" 
              v-model="newStone.assignee"
              placeholder="담당자"
              readonly
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">
              참여자
            </label>
            <div class="form-input-wrapper">
              <input 
                type="text" 
                class="form-input" 
                v-model="newStone.participants"
                placeholder="참여자를 선택하세요"
                readonly
              />
              <button 
                type="button"
                class="btn-select-user"
                @click="openUserSelectModal('participants')"
              >
                참여자 선택
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              채팅방 생성
            </label>
            <div class="checkbox-wrapper">
              <input 
                type="checkbox" 
                class="form-checkbox" 
                v-model="newStone.createChat"
                id="createChat"
              />
              <label for="createChat" class="checkbox-label"></label>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeCreateStoneModal">
            취소
          </button>
          <button class="btn-create" @click="createStone">
            스톤 추가
          </button>
        </div>
      </div>
    </div>
    
    <!-- 사용자 선택 모달 -->
    <div v-if="showUserSelectModal" class="modal-overlay" @click="closeUserSelectModal">
      <div class="user-select-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ userSelectType === 'assignee' ? '담당자 선택' : '참여자 선택' }}
          </h2>
        </div>
        
        <div class="modal-body">
          <!-- 1. 사용자 그룹 섹션 -->
          <div class="search-section">
            <h3 class="section-title">사용자 그룹</h3>
            <div class="group-list">
              <div 
                v-for="group in userGroupList" 
                :key="group.groupId"
                class="group-item"
                @click="selectGroup(group.groupName)"
              >
                <span class="group-name">{{ group.groupName }}</span>
                <span class="group-count">{{ group.participantCount }}명</span>
                <button 
                  class="btn-add-group"
                  @click.stop="addGroupToSelected(group.groupName)"
                >
                  추가
                </button>
              </div>
              <div v-if="userGroupList.length === 0" class="no-groups">
                그룹이 없습니다.
              </div>
            </div>
          </div>
          
          <!-- 2. 이메일 검색 섹션 -->
          <div class="search-section">
            <h3 class="section-title">이메일 검색</h3>
            <div class="search-group">
              <input 
                type="text" 
                class="search-input"
                v-model="userSearchKeyword"
                @keyup.enter="searchUsers"
                placeholder="이메일로 검색..."
              />
              <button class="btn-search" @click="searchUsers">
                검색
              </button>
            </div>
          </div>
          
          <!-- 3. 이메일 검색 결과 섹션 -->
          <div class="search-section">
            <h3 class="section-title">이메일 검색 결과</h3>
            <div class="user-list">
              <div 
                v-for="user in emailSearchResults" 
                :key="user.id"
                class="user-item search-result-item"
              >
                <div class="user-info search-result-info" @click="selectUser(user)">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
                <button class="btn-add-user" @click="selectUser(user)">
                  추가
                </button>
              </div>
              <div v-if="emailSearchResults.length === 0" class="no-results">
                검색 결과가 없습니다.
              </div>
            </div>
          </div>
          
          <!-- 4. 선택된 사용자 섹션 -->
          <div class="search-section">
            <h3 class="section-title">선택된 사용자</h3>
            <div v-if="allSelectedUsers.length > 0" class="selected-group-members">
              <div 
                v-for="member in allSelectedUsers" 
                :key="member.id"
                class="selected-member-item"
              >
                <div class="user-info">
                  <div class="user-name">{{ member.name }}</div>
                  <div class="user-email">{{ member.email }}</div>
                </div>
                <button 
                  class="btn-remove-member" 
                  @click="removeMember(member.id)"
                >
                  ×
                </button>
              </div>
              <button class="btn-clear-all" @click="clearAllMembers">
                전체 해제
              </button>
            </div>
            <div v-else-if="selectedUser" class="selected-user-item">
              <div class="user-info">
                <div class="user-name">{{ selectedUser.name }}</div>
                <div class="user-email">{{ selectedUser.email }}</div>
              </div>
              <button class="btn-remove-selection" @click="removeSelectedUser">
                선택 해제
              </button>
            </div>
            <div v-else class="no-selection">
              사용자를 선택해주세요.
            </div>
          </div>
        </div>
        
          <div class="modal-footer">
            <button class="btn-confirm" @click="confirmUserSelection">
              확인
            </button>
            <button class="btn-cancel" @click="closeUserSelectModal">
              취소
            </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as d3 from 'd3';

export default {
  name: 'ProjectList',
  data() {
    return {
      activeTab: 'milestone',
      projectName: '오르빗 출시',
      projectDescription: '프로젝트 협업을 위한 일정 관리 서비스',
      stones: [],
      loading: false,
      scale: 1,
      minScale: 0.5,
      maxScale: 2,
      zoomStep: 0.1,
      translate: { x: 0, y: 0 },
      isPanning: false,
      startPt: { x: 0, y: 0 },
      startTranslate: { x: 0, y: 0 },
      panMode: false,
      canvasWidth: 1000,
      canvasHeight: 600,
      stoneNodes: [],
      connections: [],
      showCreateStoneModal: false,
      selectedParentStone: null,
      newStone: {
        parentStoneName: '',
        stoneName: '',
        startTime: '',
        endTime: '',
        assignee: '', // loadCurrentUserInfo에서 설정됨
        participants: '',
        createChat: false
      },
      showUserSelectModal: false,
      userSelectType: '', // 'assignee' or 'participants'
      userSearchKeyword: '',
      selectedGroup: '',
      userGroupList: [], // 사용자 그룹 목록
      emailSearchResults: [], // 이메일 검색 결과
      selectedUser: null, // 선택된 사용자
      selectedGroupMembers: [], // 선택된 그룹의 멤버들
      allSelectedUsers: [], // 모든 선택된 사용자들 (누적)
      currentUser: {
        id: '',
        name: '',
        email: ''
      },
      userList: [
        { id: 1, name: '김을빗', email: 'eulbit@orbit.com', group: '개발팀' },
        { id: 2, name: '박프론트', email: 'front@orbit.com', group: '개발팀' },
        { id: 3, name: '이백엔드', email: 'backend@orbit.com', group: '개발팀' },
        { id: 4, name: '최디자인', email: 'design@orbit.com', group: '디자인팀' },
        { id: 5, name: '정기획', email: 'plan@orbit.com', group: '기획팀' }
      ],
      filteredUserList: []
    };
  },
  async mounted() {
    // 현재 사용자 정보 로드
    await this.loadCurrentUserInfo();
    
    const projectId = this.$route.query.id;
    if (projectId) {
      // 프로젝트 상세 정보는 선택적으로 로드 (실패해도 계속 진행)
      try {
        await this.loadProjectDetail(projectId);
      } catch (error) {
        console.log('프로젝트 상세 정보 로드 실패, 기본값 사용');
      }
      
      // 스톤 목록은 반드시 로드
      await this.loadStones(projectId);
    }
    
    // 캔버스 크기 업데이트
    this.$nextTick(() => {
      this.updateCanvasSize();
    });
    
    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', this.updateCanvasSize);
    
    // 키보드 이벤트 리스너 추가 (Space 키로 팬 모드 토글)
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },
  watch: {
    stones: {
      handler(newStones) {
        if (newStones && newStones.length > 0) {
          this.stoneNodes = this.convertStonesToNodes(newStones);
          this.$nextTick(() => {
            this.updateStonePositions();
            this.updateConnections();
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 현재 사용자 정보 로드
    async loadCurrentUserInfo() {
      const userId = localStorage.getItem('id');
      
      if (!userId) {
        console.log('사용자 ID가 없습니다.');
        return;
      }
      
      try {
        // user-service에서 사용자 정보 가져오기
        const response = await axios.get(
          `http://localhost:8080/user-service/user/${userId}`
        );
        
        if (response.data.statusCode === 200) {
          const userInfo = response.data.result;
          
          this.currentUser = {
            id: userId,
            name: userInfo.name,
            email: userInfo.email
          };
          
          // 담당자 필드에 현재 사용자 이름 설정
          this.newStone.assignee = userInfo.name;
          
          // 사용자 목록에 현재 사용자가 없으면 추가
          const existingUser = this.userList.find(user => user.name === userInfo.name);
          if (!existingUser) {
            this.userList.unshift({
              id: userId,
              name: userInfo.name,
              email: userInfo.email,
              group: '개발팀' // 기본 그룹
            });
          }
          
          console.log('현재 사용자 정보:', this.currentUser);
        } else {
          console.error('사용자 정보 조회 실패:', response.data);
          this.setDefaultUser();
        }
      } catch (error) {
        console.error('사용자 정보 API 호출 실패:', error);
        this.setDefaultUser();
      }
    },
    
    // 기본 사용자 정보 설정
    setDefaultUser() {
      this.currentUser = {
        id: localStorage.getItem('id') || '',
        name: '김을빗',
        email: 'eulbit@orbit.com'
      };
      this.newStone.assignee = '김을빗';
    },
    
    async loadProjectDetail(projectId) {
      try {
        const userId = localStorage.getItem('id');
        const response = await axios.get(
          `http://localhost:8080/workspace-service/project/detail/${projectId}`,
          {
            headers: {
              'X-User-Id': userId
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          const projectData = response.data.result;
          this.projectName = projectData.projectName || '프로젝트';
          this.projectDescription = projectData.projectDescription || '프로젝트 협업을 위한 일정 관리 서비스';
        }
      } catch (error) {
        console.error('프로젝트 상세 정보 로드 실패:', error);
      }
    },
    async loadStones(projectId) {
      try {
        this.loading = true;
        const userId = localStorage.getItem('id');
        const response = await axios.get(
          `http://localhost:8080/workspace-service/project/stones/${projectId}`,
          {
            headers: {
              'X-User-Id': userId
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          this.stones = response.data.result || [];
          console.log('스톤 목록 로드 성공:', this.stones);
          console.log('첫 번째 스톤의 childStone:', this.stones[0]?.childStone);
        } else {
          console.log('스톤 목록 응답 상태 코드:', response.data.statusCode);
          this.stones = [];
        }
      } catch (error) {
        console.error('스톤 목록 로드 실패:', error);
        // API 실패 시 테스트용 더미 데이터 사용
        this.stones = [
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
        ];
        console.log('테스트용 스톤 데이터 사용:', this.stones);
      } finally {
        this.loading = false;
      }
    },
    handleEditStone(stone) {
      console.log('스톤 수정:', stone);
      // TODO: 스톤 수정 모달 열기
    },
    handleDeleteStone(stone) {
      console.log('스톤 삭제:', stone);
      // TODO: 스톤 삭제 확인 후 API 호출
    },
    handleAddStone(stone) {
      console.log('스톤 추가:', stone);
      // TODO: 스톤 추가 API 호출
    },
    // ERD Cloud 스타일 팬/줌 메서드들
    
    // 휠 이벤트 핸들러
    onWheel(e) {
      e.preventDefault();
      
      if (e.ctrlKey) {
        // Ctrl + 휠: 줌
        const k = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = this.clamp(this.scale * k, this.minScale, this.maxScale);
        this.applyZoom(newScale, { x: e.offsetX, y: e.offsetY });
      } else {
        // 일반 휠: 팬 (수평/수직 이동)
        this.translate.x -= e.deltaX;
        this.translate.y -= e.deltaY;
      }
    },
    
    // 마우스 다운 이벤트 핸들러
    onMouseDown(e) {
      if (e.button === 0 && (this.panMode || e.target.classList.contains('milestone-svg'))) { // 좌클릭 + Space 키 또는 SVG 배경 클릭
        this.isPanning = true;
        this.startPt = { x: e.clientX, y: e.clientY };
        this.startTranslate = { ...this.translate };
        e.preventDefault();
      }
    },
    
    // 마우스 이동 이벤트 핸들러
    onMouseMove(e) {
      if (this.isPanning) {
        this.translate.x = this.startTranslate.x + (e.clientX - this.startPt.x);
        this.translate.y = this.startTranslate.y + (e.clientY - this.startPt.y);
        e.preventDefault();
      }
    },
    
    // 마우스 업 이벤트 핸들러
    onMouseUp(e) {
      this.isPanning = false;
    },
    
    // 키보드 이벤트 핸들러들
    onKeyDown(e) {
      if (e.code === 'Space' && !this.panMode) {
        this.panMode = true;
        e.preventDefault();
      }
    },
    
    onKeyUp(e) {
      if (e.code === 'Space' && this.panMode) {
        this.panMode = false;
        this.isPanning = false; // Space 키를 놓으면 팬 중단
        e.preventDefault();
      }
    },
    
    // 줌 적용 (중심점 기준)
    applyZoom(newScale, center) {
      const ratio = newScale / this.scale;
      this.translate.x = center.x - ratio * (center.x - this.translate.x);
      this.translate.y = center.y - ratio * (center.y - this.translate.y);
      this.scale = newScale;
    },
    
    // 값 제한 유틸리티
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    
    // + / - 버튼용 줌 메서드들
    zoomIn() {
      if (this.scale < this.maxScale) {
        const newScale = this.clamp(this.scale + this.zoomStep, this.minScale, this.maxScale);
        const center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
        this.applyZoom(newScale, center);
      }
    },
    
    zoomOut() {
      if (this.scale > this.minScale) {
        const newScale = this.clamp(this.scale - this.zoomStep, this.minScale, this.maxScale);
        const center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
        this.applyZoom(newScale, center);
      }
    },
    
    // 실제 그래프의 bounding box 중심 계산
    calculateGraphCenter() {
      this.$nextTick(() => {
        const svgElement = this.$refs.milestoneCanvas?.querySelector('.milestone-svg');
        if (!svgElement) return;
        
        const gElement = svgElement.querySelector('g');
        if (!gElement) return;
        
        try {
          // D3를 사용하여 bounding box 계산
          const bbox = d3.select(gElement).node().getBBox();
          
          // 그래프의 실제 중심점 계산
          const graphCenterX = bbox.x + bbox.width / 2;
          const graphCenterY = bbox.y + bbox.height / 2;
          
          // SVG 중심점
          const svgCenterX = this.canvasWidth / 2;
          const svgCenterY = this.canvasHeight / 2;
          
          // 그래프를 SVG 중앙에 위치시키기 위한 translate 계산
          this.translate.x = svgCenterX - graphCenterX;
          this.translate.y = svgCenterY - graphCenterY;
          
          console.log('그래프 중심점 계산:', {
            bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
            graphCenter: { x: graphCenterX, y: graphCenterY },
            svgCenter: { x: svgCenterX, y: svgCenterY },
            translate: { x: this.translate.x, y: this.translate.y }
          });
        } catch (error) {
          console.warn('Bounding box 계산 실패, 기본 중심점 사용:', error);
          // fallback: SVG 중심점 사용
          this.translate.x = this.canvasWidth / 2;
          this.translate.y = this.canvasHeight / 2;
        }
      });
    },
    // 스톤 관련 메서드들
    onStoneClick(stone) {
      console.log('스톤 클릭:', stone);
    },
    calculateDDay(endTime) {
      if (!endTime) return null;
      const endDate = new Date(endTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return `D-${diffDays}`;
      } else if (diffDays === 0) {
        return 'D-Day';
      } else {
        return `D+${Math.abs(diffDays)}`;
      }
    },
    convertStonesToNodes(stones) {
      const nodes = [];
      console.log('convertStonesToNodes 호출됨, 입력 stones:', stones);
      
      // 재귀적으로 스톤을 노드로 변환하는 함수
      const convertStoneToNode = (stone) => {
        console.log('convertStoneToNode 처리 중:', stone.stoneName, 'childStone:', stone.childStone);
        
        const node = {
          id: stone.stoneId,
          name: stone.stoneName,
          milestone: stone.milestone,
          startTime: stone.startTime,
          endTime: stone.endTime,
          isRoot: stone.parentStoneId === null,
          parentId: stone.parentStoneId,
          dDay: this.calculateDDay(stone.endTime),
          createdAt: stone.createdAt,
          x: 0,
          y: 0
        };
        nodes.push(node);
        console.log('스톤 노드 추가:', node.name, '부모:', node.parentId, '루트:', node.isRoot);
        
        // 하위 스톤들도 재귀적으로 처리
        if (stone.childStone && stone.childStone.length > 0) {
          console.log('하위 스톤 발견:', stone.childStone.length, '개', stone.childStone);
          stone.childStone.forEach((childStone, index) => {
            console.log(`하위 스톤 ${index + 1} 처리:`, childStone.stoneName);
            convertStoneToNode(childStone);
          });
        } else {
          console.log('하위 스톤 없음:', stone.stoneName);
        }
      };
      
      // 모든 최상위 스톤들을 처리
      stones.forEach((stone, index) => {
        console.log(`최상위 스톤 ${index + 1} 처리:`, stone.stoneName);
        convertStoneToNode(stone);
      });
      
      console.log('총 스톤 노드 개수:', nodes.length, '노드들:', nodes);
      return nodes;
    },
    // D3.js 기반 트리 배치
    updateStonePositionsWithD3() {
      if (this.stoneNodes.length === 0) return;
      
      console.log('D3.js 트리 배치 시작');
      
      // 스톤 데이터를 D3.js 계층 구조로 변환
      const rootStone = this.stoneNodes.find(stone => stone.isRoot);
      if (!rootStone) return;
      
      const d3Data = this.convertToD3Hierarchy(rootStone);
      console.log('D3 데이터:', d3Data);
      
      // D3.js 트리 레이아웃 설정
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      
      const tree = d3.tree()
        .size([width - 200, height - 200])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
      
      const root = d3.hierarchy(d3Data, d => d.children);
      tree(root);
      
      // D3.js 계산된 위치를 stoneNodes에 적용
      root.descendants().forEach((node, index) => {
        const stone = this.stoneNodes.find(s => s.id === node.data.id);
        if (stone) {
          stone.x = node.x + 100;
          stone.y = node.y + 100;
          console.log(`${stone.name} D3 위치: (${stone.x}, ${stone.y})`);
        }
      });
      
      // 연결선 업데이트
      this.updateConnections();
      
      // 캔버스 크기 조정 및 중심점 재계산
      this.$nextTick(() => {
        this.adjustCanvasSizeForStones();
        // 스톤 위치가 변경된 후 그래프 중심점 재계산
        this.calculateGraphCenter();
      });
    },
    
    // 스톤 데이터를 D3.js 계층 구조로 변환
    convertToD3Hierarchy(rootStone) {
      const convertStone = (stone) => {
        const children = this.stoneNodes
          .filter(s => s.parentId === stone.id)
          .map(child => convertStone(child));
        
        return {
          id: stone.id,
          name: stone.name,
          children: children.length > 0 ? children : undefined
        };
      };
      
      return convertStone(rootStone);
    },
    updateStonePositions() {
      // D3.js 기반 트리 배치 사용
      this.updateStonePositionsWithD3();
    },
    
    // D3.js가 자동으로 겹침을 방지하므로 별도 겹침 방지 로직 불필요
    
    // D3.js가 자동으로 레벨을 계산하므로 별도 레벨 계산 로직 불필요
    updateConnections() {
      this.connections = [];
      this.stoneNodes.forEach(node => {
        const childNodes = this.stoneNodes.filter(n => n.parentId === node.id);
        childNodes.forEach(child => {
          const parentCenterX = node.x + (node.isRoot ? 90 : 75);
          const parentCenterY = node.y + (node.isRoot ? 90 : 75);
          const childCenterX = child.x + 75;
          const childCenterY = child.y + 75;
          
          const connection = {
            id: `conn-${node.id}-${child.id}`,
            x1: parentCenterX,
            y1: parentCenterY,
            x2: childCenterX,
            y2: childCenterY,
            isFromRoot: node.isRoot
          };
          this.connections.push(connection);
        });
      });
    },
    updateCanvasSize() {
      if (this.$refs.milestoneCanvas) {
        const rect = this.$refs.milestoneCanvas.getBoundingClientRect();
        this.canvasWidth = Math.max(rect.width || 1000, 800);
        this.canvasHeight = Math.max(rect.height || 600, 500);
        console.log('캔버스 크기 업데이트:', this.canvasWidth, 'x', this.canvasHeight);
        
        this.$nextTick(() => {
          this.updateStonePositions();
          this.updateConnections();
          this.adjustCanvasSizeForStones();
          // 캔버스 크기 변경 후 그래프 중심점 재계산
          this.calculateGraphCenter();
        });
      }
    },
    
    adjustCanvasSizeForStones() {
      if (this.stoneNodes.length === 0) return;
      
      // 모든 스톤의 위치를 확인하여 필요한 캔버스 크기 계산
      let maxX = 0;
      let maxY = 0;
      
      this.stoneNodes.forEach(stone => {
        const stoneWidth = stone.isRoot ? 180 : 150;
        const stoneHeight = stone.isRoot ? 180 : 150;
        maxX = Math.max(maxX, stone.x + stoneWidth);
        maxY = Math.max(maxY, stone.y + stoneHeight);
      });
      
      // 여유 공간 추가 (패딩)
      const padding = 100;
      const requiredWidth = Math.max(maxX + padding, this.canvasWidth);
      const requiredHeight = Math.max(maxY + padding, this.canvasHeight);
      
      // 캔버스 크기 업데이트
      this.canvasWidth = requiredWidth;
      this.canvasHeight = requiredHeight;
      
      console.log('스톤에 맞춘 캔버스 크기:', this.canvasWidth, 'x', this.canvasHeight);
    },
    
    // 스톤 생성 모달 관련 메서드들
    openCreateStoneModal(parentStone) {
      this.selectedParentStone = parentStone;
      this.newStone.parentStoneName = parentStone.name;
      this.showCreateStoneModal = true;
    },
    
    closeCreateStoneModal() {
      this.showCreateStoneModal = false;
      this.selectedParentStone = null;
      this.resetNewStoneForm();
    },
    
    resetNewStoneForm() {
      this.newStone = {
        parentStoneName: '',
        stoneName: '',
        startTime: '',
        endTime: '',
        assignee: this.currentUser.name || '김을빗', // 현재 사용자 이름으로 설정
        participants: '',
        createChat: false
      };
    },
    
    async createStone() {
      if (!this.validateStoneForm()) {
        return;
      }
      
      try {
        const projectId = this.$route.query.id;
        const userId = localStorage.getItem('id');
        
        // 참여자 ID 리스트 생성 (API 전송용)
        const participantIds = this.allSelectedUsers.map(user => user.id);
        
        const stoneData = {
          parentStoneId: this.selectedParentStone.id,
          stoneName: this.newStone.stoneName,
          startTime: this.newStone.startTime + 'T09:00:00',
          endTime: this.newStone.endTime + 'T18:00:00',
          chatCreation: this.newStone.createChat,
          participantIds: participantIds
        };
        
        console.log('스톤 생성 요청 데이터:', stoneData);
        
        const response = await axios.post(
          `http://localhost:8080/workspace-service/stone`,
          stoneData,
          {
            headers: {
              'X-User-Id': userId,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.statusCode === 201) {
          console.log('스톤 생성 성공:', response.data);
          alert('스톤이 성공적으로 생성되었습니다.');
          this.closeCreateStoneModal();
          // 스톤 목록 새로고침
          await this.loadStones(projectId);
        } else {
          console.error('스톤 생성 실패:', response.data);
          alert('스톤 생성에 실패했습니다.');
        }
      } catch (error) {
        console.error('스톤 생성 API 호출 실패:', error);
        alert('스톤 생성 중 오류가 발생했습니다.');
      }
    },
    
    validateStoneForm() {
      if (!this.newStone.stoneName.trim()) {
        alert('스톤명을 입력해주세요.');
        return false;
      }
      
      if (!this.newStone.startTime) {
        alert('시작일을 선택해주세요.');
        return false;
      }
      
      if (!this.newStone.endTime) {
        alert('종료일을 선택해주세요.');
        return false;
      }
      
      if (new Date(this.newStone.startTime) >= new Date(this.newStone.endTime)) {
        alert('종료일은 시작일보다 늦어야 합니다.');
        return false;
      }
      
      // 과거 날짜 입력 방지
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (new Date(this.newStone.startTime) < today) {
        alert('시작일은 오늘 날짜 이후여야 합니다.');
        return false;
      }
      
      if (new Date(this.newStone.endTime) < today) {
        alert('종료일은 오늘 날짜 이후여야 합니다.');
        return false;
      }
      
      if (!this.newStone.assignee.trim()) {
        alert('담당자를 입력해주세요.');
        return false;
      }
      
      return true;
    },
    
    // 사용자 선택 모달 열기 (참여자만)
    async openUserSelectModal(type) {
      if (type === 'assignee') return; // 담당자는 선택 불가
      this.userSelectType = type;
      this.showUserSelectModal = true;
      this.userSearchKeyword = '';
      this.selectedGroup = '';
      this.filteredUserList = [...this.userList];
      
      // 사용자 그룹 목록 로드
      await this.loadUserGroupList();
    },
    
    // 사용자 선택 모달 닫기
    closeUserSelectModal() {
      this.showUserSelectModal = false;
      this.userSelectType = '';
      this.userSearchKeyword = '';
      this.selectedGroup = '';
      this.filteredUserList = [];
      this.emailSearchResults = [];
      this.selectedUser = null;
      this.selectedGroupMembers = [];
      this.allSelectedUsers = [];
    },
    
    // 사용자 선택 확인
    confirmUserSelection() {
      if (this.userSelectType === 'participants') {
        // 선택된 사용자들의 이름을 참여자 목록에 표시
        const participantNames = this.allSelectedUsers.map(user => user.name);
        this.newStone.participants = participantNames.join(', ');
        console.log('선택된 참여자 이름들:', participantNames);
        console.log('선택된 참여자 ID들:', this.allSelectedUsers.map(user => user.id));
      }
      this.closeUserSelectModal();
    },
    
    // 그룹 선택
    async selectGroup(groupName) {
      this.selectedGroup = groupName;
      await this.loadGroupMembers();
    },
    
    // 그룹을 선택된 사용자에 추가
    async addGroupToSelected(groupName) {
      this.selectedGroup = groupName;
      await this.loadGroupMembersForSelection();
    },
    
    // 사용자 검색 API 호출
    async searchUsers() {
      if (!this.userSearchKeyword.trim()) {
        this.emailSearchResults = [];
        return;
      }
      
      try {
        const userId = localStorage.getItem('id');
        const workspaceId = localStorage.getItem('selectedWorkspaceId');
        
        const response = await axios.post(
          `http://localhost:8080/workspace-service/workspace/participants/search`,
          {
            workspaceId: workspaceId,
            searchKeyword: this.userSearchKeyword.trim()
          },
          {
            headers: {
              'X-User-Id': userId,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          const users = response.data.result.userInfoList || [];
          
          // API 응답을 사용자 목록 형식으로 변환
          this.emailSearchResults = users.map(user => ({
            id: user.userId,
            name: user.userName,
            email: user.userEmail,
            group: '검색결과'
          }));
          
          console.log('검색 결과:', this.emailSearchResults);
        } else {
          console.error('사용자 검색 실패:', response.data);
          this.emailSearchResults = [];
        }
      } catch (error) {
        console.error('사용자 검색 API 호출 실패:', error);
        this.emailSearchResults = [];
      }
    },
    
    // 사용자 필터링 (기존 로직 유지)
    async filterUsers() {
      // 그룹이 선택되었을 때 해당 그룹의 멤버들을 API로 가져오기
      if (this.selectedGroup) {
        await this.loadGroupMembers();
      } else {
        // 검색어가 있으면 검색 API 호출
        if (this.userSearchKeyword.trim()) {
          await this.searchUsers();
        } else {
          this.emailSearchResults = [];
        }
      }
    },
    
    // 사용자 선택 (참여자만)
    selectUser(user) {
      this.selectedUser = user;
      
      // 기존 선택된 사용자들과 중복 제거하면서 추가
      const existingIndex = this.allSelectedUsers.findIndex(selectedUser => selectedUser.id === user.id);
      if (existingIndex === -1) {
        this.allSelectedUsers.push(user);
      }
      
      if (this.userSelectType === 'participants') {
        const memberNames = this.allSelectedUsers.map(member => member.name);
        this.newStone.participants = memberNames.join(', ');
      }
    },
    
    // 선택된 사용자 해제
    removeSelectedUser() {
      this.selectedUser = null;
      if (this.userSelectType === 'participants') {
        this.newStone.participants = '';
      }
    },
    
    // 개별 멤버 제거
    removeMember(memberId) {
      this.allSelectedUsers = this.allSelectedUsers.filter(member => member.id !== memberId);
      
      // 참여자 필드 업데이트
      if (this.userSelectType === 'participants') {
        if (this.allSelectedUsers.length > 0) {
          const memberNames = this.allSelectedUsers.map(member => member.name);
          this.newStone.participants = memberNames.join(', ');
        } else {
          this.newStone.participants = '';
        }
      }
    },
    
    // 모든 멤버 해제
    clearAllMembers() {
      this.allSelectedUsers = [];
      if (this.userSelectType === 'participants') {
        this.newStone.participants = '';
      }
    },
    
    // 사용자 그룹 목록 조회
    async loadUserGroupList() {
      try {
        const userId = localStorage.getItem('id');
        const workspaceId = localStorage.getItem('selectedWorkspaceId');
        
        const response = await axios.get(
          `http://localhost:8080/workspace-service/groups?workspaceId=${workspaceId}`,
          {
            headers: {
              'X-User-Id': userId
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          this.userGroupList = response.data.result.content || [];
          console.log('사용자 그룹 목록:', this.userGroupList);
        } else {
          console.error('사용자 그룹 목록 조회 실패:', response.data);
          this.userGroupList = [];
        }
      } catch (error) {
        console.error('사용자 그룹 목록 API 호출 실패:', error);
        this.userGroupList = [];
      }
    },
    
    // 선택된 그룹의 멤버 조회
    async loadGroupMembers() {
      try {
        const userId = localStorage.getItem('id');
        const selectedGroup = this.userGroupList.find(group => group.groupName === this.selectedGroup);
        
        if (!selectedGroup) {
          console.error('선택된 그룹을 찾을 수 없습니다.');
          return;
        }
        
        const response = await axios.get(
          `http://localhost:8080/workspace-service/groups/${selectedGroup.groupId}`,
          {
            headers: {
              'X-User-Id': userId
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          const members = response.data.result.members.content || [];
          
          // API 응답을 사용자 목록 형식으로 변환
          const groupMembers = members.map(member => ({
            id: member.userId,
            name: member.userName,
            email: member.userEmail,
            group: this.selectedGroup
          }));
          
          // 이메일 검색 결과는 비우고, 선택된 사용자 섹션에 그룹 멤버들 표시
          this.emailSearchResults = [];
          this.selectedUser = groupMembers[0] || null; // 첫 번째 멤버를 선택된 사용자로 설정
          
          if (this.selectedUser && this.userSelectType === 'participants') {
            this.newStone.participants = this.selectedUser.name;
          }
          
          console.log('그룹 멤버 목록:', groupMembers);
        } else {
          console.error('그룹 멤버 조회 실패:', response.data);
          this.emailSearchResults = [];
          this.selectedUser = null;
        }
      } catch (error) {
        console.error('그룹 멤버 API 호출 실패:', error);
        this.emailSearchResults = [];
        this.selectedUser = null;
      }
    },
    
    // 그룹 멤버들을 선택된 사용자에 추가
    async loadGroupMembersForSelection() {
      try {
        const userId = localStorage.getItem('id');
        const selectedGroup = this.userGroupList.find(group => group.groupName === this.selectedGroup);
        
        if (!selectedGroup) {
          console.error('선택된 그룹을 찾을 수 없습니다.');
          return;
        }
        
        const response = await axios.get(
          `http://localhost:8080/workspace-service/groups/${selectedGroup.groupId}`,
          {
            headers: {
              'X-User-Id': userId
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          const members = response.data.result.members.content || [];
          
          // API 응답을 사용자 목록 형식으로 변환
          const newMembers = members.map(member => ({
            id: member.userId,
            name: member.userName,
            email: member.userEmail,
            group: this.selectedGroup
          }));
          
          // 기존 선택된 사용자들과 중복 제거하면서 추가
          newMembers.forEach(member => {
            const existingIndex = this.allSelectedUsers.findIndex(user => user.id === member.id);
            if (existingIndex === -1) {
              this.allSelectedUsers.push(member);
            }
          });
          
          // 참여자 필드에 모든 선택된 사용자 이름을 쉼표로 구분하여 추가
          if (this.userSelectType === 'participants') {
            const memberNames = this.allSelectedUsers.map(member => member.name);
            this.newStone.participants = memberNames.join(', ');
          }
          
          console.log('전체 선택된 사용자들:', this.allSelectedUsers);
        } else {
          console.error('그룹 멤버 조회 실패:', response.data);
        }
      } catch (error) {
        console.error('그룹 멤버 API 호출 실패:', error);
      }
    },
    
    // 그룹 추가 모달 표시
    showAddGroupModal() {
      // 간단한 프롬프트로 그룹명 입력 받기
      const groupName = prompt('새 그룹명을 입력하세요:');
      if (groupName && groupName.trim()) {
        this.addNewGroup(groupName.trim());
      }
    },
    
    // 새 그룹 추가
    async addNewGroup(groupName) {
      try {
        const userId = localStorage.getItem('id');
        const workspaceId = localStorage.getItem('selectedWorkspaceId');
        
        const response = await axios.post(
          `http://localhost:8080/workspace-service/groups`,
          {
            groupName: groupName,
            workspaceId: workspaceId
          },
          {
            headers: {
              'X-User-Id': userId,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.statusCode === 200) {
          console.log('그룹 생성 성공:', response.data);
          // 그룹 목록 새로고침
          await this.loadUserGroupList();
          // 새로 생성된 그룹 선택
          this.selectedGroup = groupName;
          await this.loadGroupMembers();
        } else {
          console.error('그룹 생성 실패:', response.data);
          alert('그룹 생성에 실패했습니다.');
        }
      } catch (error) {
        console.error('그룹 생성 API 호출 실패:', error);
        alert('그룹 생성 중 오류가 발생했습니다.');
      }
    }
  }
};
</script>

<style scoped>
.project-container {
  position: fixed;
  top: 83px;
  left: 280px;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  overflow: hidden;
  background: #F5F5F5;
}

/* 프로젝트 헤더 (바디 안의 헤더) */
.project-header {
  background: #F5F5F5;
  padding: 20px 50px 10px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 28px;
  line-height: 33px;
  color: #1C0F0F;
  margin: 0;
}

.edit-icon {
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s;
}

.edit-icon:hover {
  opacity: 1;
}

/* 프로젝트 설명 섹션 */
.project-description-section {
  background: #F5F5F5;
  padding: 0 50px 20px 50px;
}

.project-description-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 19px;
  color: #666666;
  margin: 0;
}

/* 탭 섹션 */
.tab-section {
  background: #F5F5F5;
  padding: 0 50px;
  border-bottom: 1px solid rgba(42, 40, 40, 0.5);
}

.tab-menu {
  display: flex;
  gap: 0;
  padding-bottom: 6px;
  width: 100%;
  border-bottom: 1px solid rgba(42, 40, 40, 0.2);
}

.tab-item {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #1C0F0F;
  cursor: pointer;
  transition: color 0.2s;
  flex: 1;
  text-align: center;
  padding-bottom: 4px;
  position: relative;
}

.tab-item.active {
  color: #FFDD44;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -7px;
  left: 0;
  right: 0;
  height: 4px;
  background: #FFDD44;
  border-radius: 2px 2px 0 0;
}


/* 스톤 생성 버튼 래퍼 */
.create-stone-button-wrapper {
  position: absolute;
  top: 20px;
  right: 45px;
  z-index: 10;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #2A2828;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background: #1a1818;
}

.create-button span {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
}

.tab-content {
  width: 100%;
  padding: 20px 45px;
  background-image: radial-gradient(circle, rgba(217, 217, 217, 0.5) 1px, transparent 1px);
  background-size: 20px 20px;
  background-repeat: repeat;
}

.placeholder-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #999999;
  text-align: center;
  padding: 50px 0;
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}

.loading-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #666666;
}

/* 확대/축소 컨트롤 */
.zoom-controls {
  position: fixed;
  bottom: 20px;
  left: 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1000;
}

.zoom-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  background: #FFFFFF;
  color: #666666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.zoom-btn:hover {
  background: #F8F8F8;
  color: #333333;
  border-color: #CCCCCC;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.zoom-btn:active {
  transform: translateY(0px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #F5F5F5;
  color: #999999;
  border-color: #E5E5E5;
}

/* 프로젝트 정보 (제목 오른쪽) */
.project-info {
  display: flex;
  align-items: center;
  gap: 24px;
}


.date-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #666666;
}

.project-owner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.owner-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #666666;
}

.calendar-icon,
.user-icon {
  opacity: 0.6;
}

/* 마일스톤 캔버스 스타일 */
.milestone-canvas {
  position: fixed;
  top: 300px;
  left: 280px;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  background: #fffdf7;
  background-image: radial-gradient(circle, rgba(217, 217, 217, 0.5) 1px, transparent 1px);
  background-size: 20px 20px;
  background-repeat: repeat;
  overflow: auto; /* 스크롤 허용 */
}

/* SVG 캔버스 */
.milestone-canvas {
  user-select: none;
  cursor: grab;
}

.milestone-canvas.panning {
  cursor: grabbing;
}

.milestone-svg {
  cursor: inherit;
}

/* SVG 스톤 그룹 */
.stone-group {
  cursor: pointer;
}

.stone-group:hover .stone-circle {
  stroke-width: 4;
}

/* SVG 텍스트 스타일 */
.stone-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  fill: #1C0F0F;
  pointer-events: none;
}

.stone-dday {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 12px;
  fill: #666666;
  pointer-events: none;
}

.milestone-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 10px;
  fill: #1C0F0F;
  pointer-events: none;
}

.stone-create-text {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 10px;
  fill: #666666;
  cursor: pointer;
}

.stone-create-text:hover {
  fill: #1C0F0F;
  font-weight: 600;
}

/* 다른 탭들 */
.other-tabs {
  position: fixed;
  top: 83px;
  left: 280px;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

.root-stone-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 6;
}

.milestone-badge {
  background: #2A2828;
  color: #FFFFFF;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  padding: 2px 6px;
  border-radius: 8px;
  position: absolute;
  top: -8px;
  left: -8px;
  z-index: 6;
}

.stone-create-text {
  position: absolute;
  bottom: 10px;
  right: -60px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #666666;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(102, 102, 102, 0.2);
  z-index: 5;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.stone-create-text:hover {
  background: rgba(255, 221, 68, 0.9);
  color: #1C0F0F;
  border-color: rgba(255, 221, 68, 0.5);
  transform: translateY(-1px);
}

/* 스톤 생성 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.create-stone-modal {
  width: 600px;
  min-height: 600px;
  max-height: 85vh;
  background: #F5F5F5;
  border: 1px solid #000000;
  box-shadow: 4px 4px 32px rgba(0, 0, 0, 0.25), -4px -4px 32px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-header {
  padding: 20px 40px 10px 40px;
  text-align: center;
  flex-shrink: 0;
}

.modal-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 28px;
  line-height: 33px;
  color: #1C0F0F;
  margin: 0;
}

.modal-body {
  flex: 1;
  padding: 15px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.form-label {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #7C7C7C;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #F4CE53;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: #1C0F0F;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25), 0 0 0 2px #F4CE53;
}

.form-input::placeholder {
  color: #CCCCCC;
}

.dropdown-arrow {
  position: absolute;
  right: 20px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #F4CE53;
  pointer-events: none;
}

.date-separator {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #7C7C7C;
  margin: 0 8px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-checkbox {
  width: 24px;
  height: 24px;
  background: #FFFFFF;
  border: 2px solid #F4CE53;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  position: relative;
}

.form-checkbox:checked {
  background: #F4CE53;
}

.form-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: bold;
}

.checkbox-label {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: #7C7C7C;
  cursor: pointer;
}

.modal-footer {
  padding: 15px 40px 20px 40px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-shrink: 0;
}

.btn-confirm {
  width: 100px;
  height: 42px;
  background: #F4CE53;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #1C0F0F;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm:hover {
  background: #E6B800;
}

.btn-confirm:active {
  transform: translateY(1px);
}

.btn-cancel {
  width: 100px;
  height: 42px;
  background: #FFFFFF;
  border: 2px solid #DDDDDD;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #F8F8F8;
  border-color: #CCCCCC;
  color: #333333;
}

.btn-cancel:active {
  transform: translateY(1px);
}

.btn-create {
  width: 120px;
  height: 42px;
  background: #2A2828;
  border-radius: 8px;
  border: none;
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 19px;
  color: #F5F5F5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-create:hover {
  background: #1a1818;
}

.btn-create:active {
  transform: translateY(1px);
}

/* 사용자 선택 버튼 스타일 */
.btn-select-user {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  padding: 0 12px;
  background: #F4CE53;
  border: none;
  border-radius: 6px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #1C0F0F;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-select-user:hover {
  background: #E6B800;
}

/* 사용자 선택 모달 스타일 */
.user-select-modal {
  width: 500px;
  min-height: 400px;
  max-height: 80vh;
  background: #F5F5F5;
  border: 1px solid #000000;
  box-shadow: 4px 4px 32px rgba(0, 0, 0, 0.25), -4px -4px 32px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-label {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #7C7C7C;
}

.search-select {
  height: 40px;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  padding: 0 12px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  background: #FFFFFF;
  cursor: pointer;
}

.search-select:focus {
  outline: none;
  border-color: #F4CE53;
}

/* 그룹 목록 스타일 */
.group-list {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  background: #FFFFFF;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 1px solid #F5F5F5;
  transition: background-color 0.2s ease;
}

.group-item:hover {
  background-color: #F8F8F8;
}

.group-item:last-child {
  border-bottom: none;
}

.group-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #1C0F0F;
  flex: 1;
}

.group-count {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #666666;
  margin-right: auto;
}

.btn-add-group {
  height: 24px;
  padding: 0 10px;
  background: #F4CE53;
  border: none;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 11px;
  color: #1C0F0F;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-add-group:hover {
  background: #E6B800;
}

.no-groups {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
}

.search-input {
  height: 40px;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  padding: 0 12px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  background: #FFFFFF;
}

.search-input:focus {
  outline: none;
  border-color: #F4CE53;
}

.btn-search {
  height: 40px;
  padding: 0 16px;
  background: #F4CE53;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #1C0F0F;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-left: 8px;
}

.btn-search:hover {
  background: #E6B800;
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  background: #FFFFFF;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
}

/* 이메일 검색 결과 섹션의 user-list */
.search-section .user-list {
  display: block;
  padding: 8px;
  gap: 0;
}

.user-item {
  padding: 6px 8px;
  cursor: pointer;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  background: #FFFFFF;
  transition: all 0.2s ease;
  min-width: 100px;
  flex: 0 0 auto;
}

/* 이메일 검색 결과 전용 스타일 */
.search-result-item {
  width: 100%;
  padding: 3px 8px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F5F5F5;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
  cursor: pointer;
}

.search-result-info .user-name {
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
  font-weight: 600;
  font-size: 12px;
  color: #1C0F0F;
}

.search-result-info .user-email {
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
  font-weight: 400;
  font-size: 10px;
  color: #666666;
}

.btn-add-user {
  height: 24px;
  padding: 0 8px;
  background: #F4CE53;
  border: none;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 11px;
  color: #1C0F0F;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.btn-add-user:hover {
  background: #E6B800;
}

.user-item:hover {
  background-color: #F8F8F8;
  border-color: #F4CE53;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #1C0F0F;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 10px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-group {
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #F4CE53;
  background: rgba(244, 206, 83, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
}

/* 섹션 제목 스타일 */
.section-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #1C0F0F;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #F4CE53;
}

/* 검색 결과 없음 메시지 */
.no-results {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
}

/* 선택된 사용자 없음 메시지 */
.no-selection {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  background: #F8F8F8;
  border: 1px dashed #DDDDDD;
  border-radius: 8px;
}

.selected-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #F8F8F8;
  border: 2px solid #F4CE53;
  border-radius: 8px;
}

.btn-remove-selection {
  height: 32px;
  padding: 0 12px;
  background: #FF6B6B;
  border: none;
  border-radius: 6px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-remove-selection:hover {
  background: #FF5252;
}

/* 선택된 그룹 멤버들 스타일 */
.selected-group-members {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #DDDDDD;
  border-radius: 8px;
  background: #FFFFFF;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.selected-member-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  background: #F8F8F8;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  flex: 0 0 auto;
  min-width: 120px;
}

.selected-member-item:last-child {
  margin-bottom: 0;
}

.btn-remove-member {
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: none;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #FF6B6B;
  cursor: pointer;
  padding: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 1;
}

.btn-remove-member:hover {
  color: #FF5252;
}

.btn-clear-all {
  width: 100%;
  height: 28px;
  margin-top: 8px;
  background: #FF6B6B;
  border: none;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1 1 100%;
}

.btn-clear-all:hover {
  background: #FF5252;
}
</style>
