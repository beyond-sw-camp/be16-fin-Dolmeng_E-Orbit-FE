import AdminDashboard from '@/views/Admin/AdminDashboard.vue';
import CreatePermissionGroup from '@/views/Admin/CreatePermissionGroup.vue';
import EditPermissionGroup from '@/views/Admin/EditPermissionGroup.vue';
import MemberManagement from '@/views/Admin/MemberManagement.vue';
import InviteMember from '@/views/Admin/InviteMember.vue';
import DeleteMembers from '@/views/Admin/DeleteMembers.vue';

export const adminRouter = [
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    },
    {
        path: '/admin/create-permission-group',
        name: 'CreatePermissionGroup',
        component: CreatePermissionGroup,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    },
    {
        path: '/admin/edit-permission-group/:groupId',
        name: 'EditPermissionGroup',
        component: EditPermissionGroup,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    },
    {
        path: '/admin/member-management',
        name: 'MemberManagement',
        component: MemberManagement,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    },
    {
        path: '/admin/invite-member',
        name: 'InviteMember',
        component: InviteMember,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    },
    {
        path: '/admin/delete-members',
        name: 'DeleteMembers',
        component: DeleteMembers,
        meta: {
            requiresAuth: true,
            isAdmin: true
        }
    }
];
