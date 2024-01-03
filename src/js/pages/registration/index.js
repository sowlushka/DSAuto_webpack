//Прорисовка страницы регистрации
import { createRegForm } from "./reg-form";

const page=document.createElement('div');
page.classList.add('registration-wrapper');
page.append(createRegForm());

export const RegistrattionPage=()=>{
    const html=new DocumentFragment;
    html.append(page);
    return html;
}