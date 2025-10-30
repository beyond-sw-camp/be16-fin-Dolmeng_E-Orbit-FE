import { reactive } from 'vue';

export const notificationState = reactive({
  chatUnreadCount: 0,
});

export function setChatUnreadCount(count) {
  const num = Number(count) || 0;
  if (notificationState.chatUnreadCount !== num) {
    notificationState.chatUnreadCount = num;
  }
}

export function decreaseChatUnreadCount(by) {
  const dec = Number(by) || 0;
  if (dec <= 0) return;
  const next = Math.max(0, (Number(notificationState.chatUnreadCount) || 0) - dec);
  notificationState.chatUnreadCount = next;
}

export default { notificationState, setChatUnreadCount, decreaseChatUnreadCount };


