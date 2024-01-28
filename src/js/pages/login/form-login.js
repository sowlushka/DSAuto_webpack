//Создание формы логина
import * as constants from "../../const";
import router from "../../spa-router/index";
import { regAlertElement } from "../registration/reg-alert";


export function createForm_Login(){
    const form=document.createElement('form');
    form.classList.add('form-login');
    let html=`
        <label for="login-email">e-mail:</label>
        <input id="login-email" type="email"  name="login-email" require>
        <label for="login-password" >password:</label>
        <input id="login-password" type="password" name="login-password" require>
        <button>Вход</button>
    `;
    form.insertAdjacentHTML('afterbegin', html);
    form.addEventListener('submit',checkLogin)
    return form;
}

async function checkLogin(e){
    e.preventDefault();
    const formData=new FormData(e.target);

    try{
        const user=await fetch(constants.checkUserServer, {
            method: "POST",
            headers: {
                "accept": "*/*"
            },
            body: formData,
            referrerPolicy: "origin-when-cross-origin",
            mode: "cors"
        }).then(response=>response.json())
        .then(data=>{
            if(!data?.status){
            //Ошибка залогинивания. Отображаем сообщение об ошибке
                regAlertElement.showMessage(data.err_description);
                return false;
            }
            return data.user;
        });

        //Запоминаем пользователя
        if(user){
            const userCode={code: user['code']};
            localStorage.setItem('code', JSON.stringify(userCode));
            router.navigate("/");
        }
        
    }catch(err){
        //Неизвестная ошибка
        regAlertElement.showMessage("Ошибка!<br> Не удалось получить ответ от сервера.<br><br>"+err.message);
        return false;
    }

    
}