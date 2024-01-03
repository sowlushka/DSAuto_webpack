//Создание формы логина
import { status } from "../../status.js";


export function createForm_Login(){
    const form=document.createElement('form');
    form.classList.add('form-login');
    let html=`
        <label for="login-email">e-mail:</label>
        <input id="login-email" type="email" require>
        <label for="login-password">password:</label>
        <input id="login-password" type="password" require>
        <div class="form-message"></div>
        <button>Вход</button>
    `;
    form.insertAdjacentHTML('afterbegin', html);
    form.addEventListener('submit',checkLogin)
    return form;
}

function checkLogin(e){
    e.preventDefault();
    let pass=document.getElementById('login-password').value;
    let login=document.getElementById('login-email').value;
    let indx=status.users.findIndex(user=>user==login);
    if(pass==status.passwords[indx]){
        status.currUser=status.users[indx];
        window.location="/";
    }else{
        document.querySelector(".login-message").innerText="Неверное имя или пароль";
    }

}