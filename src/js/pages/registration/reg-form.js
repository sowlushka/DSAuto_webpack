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



function regFormValidation(e){
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

    if(formData.get('email1')!=formData.get('email2')){
        e.preventDefault();
        messageDiv.innerText="Е-маил не совпадают";
        return false;
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