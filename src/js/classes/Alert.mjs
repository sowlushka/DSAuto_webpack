//Класс пользовательского окна сообщений Alert

export class Alert{
    #alertElement;//элемент вывода сообщений на экран

    constructor(){
        this.#createAlert();

    }

    #createAlert(){
        let html=`
                <div>
                </div>
                <button id="alert-message-button">ОК</button>
        `;
        const wrapper=document.createElement('div');
        wrapper.classList.add('alert-message-wrapper');
        wrapper.insertAdjacentHTML('afterbegin',html);
        wrapper.querySelector('button').addEventListener('click',(e)=>{
            e.currentTarget.style.display="";
        });
        this.#alertElement=wrapper;
        return this.#alertElement;
    }

    get alertElement(){
        return this.#alertElement;
    }

    showMessage(str){
    //Вывод немодального сообщения в окно браузера (аналог AlertS)
        this.#alertElement.style.display="flex";
        this.#alertElement.querySelector("div").innerHTML=str;

        //Вычисляем ширину окна
        let vw=window.innerWidth;
        let elWidth=mthis.#alertElement.offsetWidth;
        messageAlert.style.left=vw/2-(elWidth/2);
    }

}