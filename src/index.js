import "./index.scss";
import { MainPage } from "./js/pages/main/index.js";
import { LoginPage } from "./js/pages/login/index.js";
import { RegistrattionPage } from "./js/pages/registration/index.js";
import router from "./js/spa-router/index.js";


//Страницы сайта
const routes = [
  { path: "/", view: MainPage },
  { path: "/login", view: LoginPage},
  { path: "/registration", view: RegistrattionPage}
];


router.initRouter({ target: document.body, routes: routes });