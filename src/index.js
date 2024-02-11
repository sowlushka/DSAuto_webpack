import "./index.scss";
import { user } from "./js/status.js";//Автозалогинивание. Проверка пользователя на сервере
import { MainPage } from "./js/pages/main/MainPage.js";
import { LoginPage } from "./js/pages/login/index.js";
import { RegistrationPage } from "./js/pages/registration/index.js";
import router from "./js/spa-router/index.js";
import { startSearch } from "./js/pages/main/StartSearch.js";



const mainPage=new MainPage(startSearch);

const routes=user?[
                    { path: "/", view: mainPage.createPage.bind(mainPage) }, 
                    { path: "/login", view: LoginPage},
                    { path: "/registration", view: RegistrationPage}
                  ]:
                  [
                    { path: "/", view: LoginPage }, 
                    { path: "/login", view: LoginPage},
                    { path: "/registration", view: RegistrationPage}
                  ];


  router.initRouter({ target: document.body, routes: routes });