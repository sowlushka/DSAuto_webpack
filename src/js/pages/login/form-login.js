//Создание формы логина
import * as constants from "../../const";
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
        //Ошибка регистрации.Отображаем сообщение об ошибке
            regAlertElement.showMessage(data.err_description);
            return false;
        }
        return data.user;
    });


    //Запоминаем пользователя
    const userCode={code: user['code']};
    localStorage.setItem('code', JSON.stringify(userCode));
    window.location="/";
    
}