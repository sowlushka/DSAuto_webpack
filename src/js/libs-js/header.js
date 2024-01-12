//Шапка проекта
import { user } from "../status";


export function createHeader(){
    const navLinks=user?.email? `
                                    <span>${user.email} </span>
                                    <a href="./logout">выход</a>
                                `:
                                `<a href="./login">вход</a>`;
    const html=`
        <h1>Катализаторы DSAuto</h1>
        <nav>
            ${navLinks}
        </nav>
    `;
    const header=document.createElement('header');
    header.insertAdjacentHTML('afterbegin', html);

    header.querySelector('a[href="./logout"]').addEventListener('click', logout);
    return header;
}

function logout(e){
    localStorage.removeItem('code');
}