//Шапка проекта

export function createHeader(){
    const html=`
        <h1>Катализаторы DSAuto</h1>
        <nav>
            <a href="./login">вход</a>
        </nav>
    `;
    const header=document.createElement('header');
    header.insertAdjacentHTML('afterbegin', html);
    return header;
}