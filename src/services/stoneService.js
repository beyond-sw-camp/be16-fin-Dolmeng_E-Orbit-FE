import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * 스톤 삭제 API
 * @param {string} stoneId - 삭제할 스톤 ID
 * @returns {Promise<Object>} API 응답 데이터
 */
export const deleteStone = async (stoneId) => {
  try {
    const userId = localStorage.getItem('id');
    
    if (!userId) {
      throw new Error('사용자 ID가 없습니다. 로그인을 확인해주세요.');
    }
    
    if (!stoneId) {
      throw new Error('스톤 ID가 필요합니다.');
    }
    
    const response = await axios.delete(`${baseURL}/workspace-service/stone/${stoneId}`, {
      headers: {
        'X-User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('스톤 삭제 API 호출 실패:', error);
    
    // 에러 메시지 처리
    if (error.response) {
      const statusCode = error.response.status;
      const message = error.response.data?.statusMessage || error.response.data?.message || '스톤 삭제에 실패했습니다.';
      
      switch (statusCode) {
        case 400:
          throw new Error(message);
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        case 403:
          throw new Error('스톤 삭제 권한이 없습니다.');
        case 404:
          throw new Error('스톤을 찾을 수 없습니다.');
        case 500:
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        default:
          throw new Error(message);
      }
    } else if (error.request) {
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '스톤 삭제 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 스톤 상세 정보 조회 API
 * @param {string} stoneId - 조회할 스톤 ID
 * @returns {Promise<Object>} 스톤 상세 정보
 */
export const getStoneDetail = async (stoneId) => {
  try {
    const userId = localStorage.getItem('id');
    
    if (!userId) {
      throw new Error('사용자 ID가 없습니다. 로그인을 확인해주세요.');
    }
    
    if (!stoneId) {
      throw new Error('스톤 ID가 필요합니다.');
    }
    
    const response = await axios.get(`${baseURL}/workspace-service/stone/${stoneId}`, {
      headers: {
        'X-User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('스톤 상세 조회 API 호출 실패:', error);
    
    if (error.response) {
      const statusCode = error.response.status;
      const message = error.response.data?.statusMessage || error.response.data?.message || '스톤 정보를 불러올 수 없습니다.';
      
      switch (statusCode) {
        case 400:
          throw new Error(message);
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        case 403:
          throw new Error('스톤 조회 권한이 없습니다.');
        case 404:
          throw new Error('스톤을 찾을 수 없습니다.');
        case 500:
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        default:
          throw new Error(message);
      }
    } else if (error.request) {
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      throw new Error(error.message || '스톤 정보 조회 중 오류가 발생했습니다.');
    }
  }
};
