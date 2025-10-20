import AdminDashboard from '@/views/Admin/AdminDashboard.vue';

export const adminRouter = [
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    }
];
