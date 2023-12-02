import * as constants from "../const.js";

export class Downloader{
    #html;//Результат загрузки
    #result={};//Объект, содержащий результат парсинга
    #url;//Адрес для закачки
    #xhr;// объект XMLHttpRequest
    #status;//Статус загрузки

    constructor(url, callback){
    //Конструктор принимает функцию
        this.#xhr=new XMLHttpRequest();
        this.startDownloading(url,callback);
    }

    async startDownloading(url, callback){
    //Постановка объекта на закачку данных методом POST
    //url - адрес для закачки
    //callback - функция для дальнейшего планирования действий с объектами
        this.#status=false;
        this.#url=url;
        this.#xhr.open("post", constants.serverVPN,true);
        this.#xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.#xhr.responseType="text";
        let body= "url="+encodeURIComponent(url);

        this.#xhr.onload=()=>{
            this.#status=true;
            this.#html=this.#xhr.response;
            this.#parse();//Парсим ответ
            //Вызываем колбэк для обработки загруженных данных и постановки новой очереди загрузки
            callback(this);
        }
        this.#xhr.send(body);
    }


    #parse(){
        this.#result.mass=Number(this.#html.match(/(?<=weight.*?>)\d+\.?\d*(?=\skg<)/si)[0]);
    }

    get result(){
    //Возвращаем результат парсинга
        return this.#result;
    }

    get status(){
    //Возвращаем статус загрузки
        return this.#status;
    }

    get url(){
        return this.#url;
    }

    get html(){
        return this.#html
    }
    
    eraseResult(){
    //Очищаем объект с результатами
        for(let key in this.#result) delete this.#result[key];//Обнуляем объект
        this.#html=null;
        this.#url=null;
    }
}