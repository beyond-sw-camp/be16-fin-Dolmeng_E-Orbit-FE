import KakaoRedirect from "../views/User/KakaoRedirect.vue";
import UserLogin from "../views/User/UserLogin.vue";


export const userRouter = [
    {
        path: "/login",
        name: "UserLogin",
        component: UserLogin,
        meta: { hideLayout: true }
    },
    {
        path: "/oauth/kakao/redirect",
        name: "KakaoRedirect",
        component: KakaoRedirect,
        meta: { hideLayout: true }
    },
]