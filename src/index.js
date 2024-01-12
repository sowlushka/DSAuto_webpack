import "./index.scss";
import { user } from "./js/status.js";//Автозалогинивание. Проверка пользователя на сервере
import { MainPage } from "./js/pages/main/index.js";
import { LoginPage } from "./js/pages/login/index.js";
import { RegistrationPage } from "./js/pages/registration/index.js";
import router from "./js/spa-router/index.js";




const routes=user?[
                    { path: "/", view: MainPage }, //Поменяется на MainPage когда отладится
                    { path: "/login", view: LoginPage},
                    { path: "/registration", view: RegistrationPage}
                  ]:
                  [
                    { path: "/", view: LoginPage }, //Поменяется на MainPage когда отладится
                    { path: "/login", view: LoginPage},
                    { path: "/registration", view: RegistrationPage}
                  ];


  router.initRouter({ target: document.body, routes: routes });