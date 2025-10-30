import RandingPage from "../components/RandingPage.vue";

export const landingRouter = [
  {
    path: "/landing",
    name: "Landing",
    component: RandingPage,
    meta: { hideLayout: true, hideChatbot: true },
  },
];


