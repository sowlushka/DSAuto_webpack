
import { createForm_Login } from "./form-login";




export const LoginPage=createLoginPage;


export function createLoginPage(){
    const page=document.createElement('div');
    page.classList.add('login-wrapper');

    page.append(createForm_Login());

    const regLink=document.createElement('a');
    regLink.setAttribute("href","./registration");
    regLink.innerText="Регистрация";
    page.append(regLink);

    const html=new DocumentFragment;
    html.append(page);
    return html;
}