//Класс показа прогресса


export class WorkProgress{
    #div;//Элемент, на котором показываем прогресс
    #currValue;//Текущее значение для отображения прогресса
    #finishValue;//Значение для окончания прогресса
    #autoclose;//Автозакрытие прогресса при достижении финиша

    /**
     * @constructor
     * @param {DOMElement} div Объект DOM элемента, выступающий в качестве прогресса
     * @param {Number} finishValue конечное значение прогресса (целое число)
     * @param {String} startMessage сообщение при запуске прогресса
     * @param {Boolean} autoclose Автоматическое закрытие прогресса при достижении конца currValue==finishValue
     */
    constructor(div, finishValue, startMessage="", autoclose=true, ){
        this.#div=div;
        if(finishValue)this.#finishValue=finishValue;
        this.#autoclose=autoclose;
        this.#div.style.display="block";
        this.#div.innerHTML=startMessage;
    }

    /**
     *Функция устанавливает прогресс в новое значение. Отображает сообщение о текущем прогрессе и графически цветом бэкграунда
     * @param {String} message Сообщение о ходе прогресса
     * @param {Number} currValue Текущее значение програсса (целое число)
     * @param {Number} finishValue Конечное значение прогресса (целое число)
     */
    showProgress(message, currValue, finishValue=this.#finishValue){
    //Показать прогресс
        this.#currValue=currValue;
        if(finishValue!=this.#finishValue)this.#finishValue=finishValue;
        
        if(currValue>=finishValue && this.#autoclose){
            this.close();
        }else{
        //Отображаем прогресс
            this.#div.innerHTML=message;
            let percent=Math.floor(currValue/finishValue*100);
            let background=`linear-gradient(90deg, rgb(27, 115, 42, 0.8) ${percent}%, rgb(18, 3, 52, 0.8) ${percent+5>100?100:percent+5}%)`;
            this.#div.style.background=background;
        }
    }

    close(){
        this.#div.style.display="";
        this.#div.style.background="";
    }

    get currValue(){
        return this.#currValue;
    }

    get finishValue(){
        return this.#finishValue;
    }

}