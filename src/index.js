import "./index.scss";
import { checkUser } from "./js/libs-js/network/checkuser.js";
import { MainPage } from "./js/pages/main/index.js";
import { LoginPage } from "./js/pages/login/index.js";
import { RegistrationPage } from "./js/pages/registration/index.js";
import router from "./js/spa-router/index.js";


const user=await checkUser();//Проверяем регистрацию пользователя на сервере

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