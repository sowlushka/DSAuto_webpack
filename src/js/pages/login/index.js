
import { createForm_Login } from "./form-login";

const page=document.createElement('div');
page.classList.add('wrapper');

page.append(createForm_Login());


export const LoginPage=()=>{
    const html=new DocumentFragment;
    html.append(page);
    return html;
}