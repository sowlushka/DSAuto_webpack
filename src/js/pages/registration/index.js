//Прорисовка страницы регистрации
import { createRegForm } from "./reg-form";
import { regAlertElement } from "./reg-alert";

const page=document.createElement('div');
page.classList.add('registration-wrapper');
page.append(createRegForm());

export const RegistrationPage=()=>{
    const html=new DocumentFragment;
    html.append(page, regAlertElement.alertElement);
    return html;
}