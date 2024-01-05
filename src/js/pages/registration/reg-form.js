import * as constants from '../../const';//Константы проекта
import { regAlertElement } from "./reg-alert";//Подгружаем объект управления окном системных сообщений страницы Регистрация

export function createRegForm(){
    const form=document.createElement('form');
    form.classList.add('reg-form');
    
    const html=`
        <label for="email1">E-mail:</label>
        <input id="email1" name="email1" type="email" autocomplete="off">
        <label for="email2">Повторите E-mail:</label>
        <input id="email2" name="email2" type="email" autocomplete="off">
        <label for="pass1">Пароль:</label>
        <input id="pass1" name="pass1" type="password" autocomplete="off">
        <label for="pass2">Повторите пароль:</label>
        <input id="pass2" name="pass2" type="password" autocomplete="off">
        <div class="form-message"></div>
        <a class="link-button" href="/login">Регистрация</a>
    `;


    form.insertAdjacentHTML('afterbegin', html);
    form.querySelector("a").addEventListener('click', regFormValidation);
    const inputs=form.querySelectorAll('input');

    //При получении фокуса инпутом формы стираем сообщение об ошибке
    inputs.forEach(input=>input.addEventListener('focus',(e)=>{e.target.parentNode.querySelector('.form-message').innerText=""}));
    return form;
}



async function regFormValidation(e){
    e.preventDefault();
    const form=e.target.parentNode;
    const messageDiv=form.querySelector('.form-message');
    const formData= new FormData(form);
    
    const email1=formData.get('email1');
    const email2=formData.get('email2');
    if(!email1 || !email2){
        e.preventDefault();
        messageDiv.innerText="Поля е-маил не заполнены";
        return false;
    }

    if(!isEmailValid(email1) || !isEmailValid(email2)){
        e.preventDefault();
        messageDiv.innerText="Е-маил записаны некорректно";
        return false;
    }

    if(email1!=email2){
        e.preventDefault();
        messageDiv.innerText="Е-маил не совпадают";
        return false;
    }

    const pass1=formData.get('pass1');
    const pass2=formData.get('pass2');
    if(!pass1 || !pass2 || pass1!=pass2){
        e.preventDefault();
        messageDiv.innerText="Пароли не совпадают";
        return false;
    }

    const result=await regUser(email1, pass1);//Регистрация пользовател в базе данных
    if (result){
        const message="<p>На е-маил отправлено письмо.</p> <p>Завершите регистрацию кликом на ссылку в письме</p>";
         regAlertElement.showMessage(message);
    }
}

/**
 * 
 * @param {string} email 
 */
function isEmailValid(email){
    const regexp=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/u;
    return regexp.test(email);
}

async function regUser(email, password){
//Регистрируем пользователя в базе данных сервиса
    const result=await fetch(constants.regServerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "accept": "*/*"
        },
        body: "email="+encodeURIComponent(email)+"&password="+encodeURIComponent(password),
        referrerPolicy: "origin-when-cross-origin",
        mode: "cors"
    }).then(response=>response.json())
    .then(data=>{
        if(!data?.status){
        //Ошибка регистрации.Отображаем сообщение об ошибке
            regAlertElement.showMessage(data.err_description);
            return false;
        }
        
        return true;//Регистрация на сервере не вернула ошибок
    });

    return result;
}