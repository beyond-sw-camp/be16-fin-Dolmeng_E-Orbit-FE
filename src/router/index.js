import { createRouter, createWebHistory } from 'vue-router'
import { homeRouter } from "./HomeRouter";
import { mainRouter } from './MainRouter';
import { userRouter } from './UserRouter';
import { chatRouter } from './ChatRouter';
import { workspaceRouter } from './WorkspaceRouter';
import { adminRouter } from './AdminRouter';

const routes = [
    ...homeRouter,
    ...mainRouter,
    ...userRouter,
    ...chatRouter,
    ...workspaceRouter,
    ...adminRouter,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;