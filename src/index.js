import "./index.scss";
import { MainPage } from "./js/pages/main/index.js";
import router from "./js/spa-router/index.js";

//Страницы сайта
const routes = [
  { path: "/", view: MainPage }
  
];


router.initRouter({ target: document.body, routes: routes });