import "./index.scss";
import { user } from "./js/libs-js/network/checkuser.js";
import { MainPage } from "./js/pages/main/index.js";
import { LoginPage } from "./js/pages/login/index.js";
import { RegistrationPage } from "./js/pages/registration/index.js";
import router from "./js/spa-router/index.js";


//Страницы сайта
user.then(data=>{
  const routes = [
    { path: "/", view: LoginPage }, //Поменяется на MainPage когда отладится
    { path: "/login", view: LoginPage},
    { path: "/registration", view: RegistrationPage}
  ];


  router.initRouter({ target: document.body, routes: routes });

});

/**
 * В ТАКОМ ВАРИАНТЕ РОУТЕР РАБОТАЕТ
 * 
 * const routes = [
    { path: "/", view: LoginPage },
    { path: "/login", view: LoginPage},
    { path: "/registration", view: RegistrationPage}
  ];


  router.initRouter({ target: document.body, routes: routes });
 */