import * as constants from "../const.js";

export class Downloader{
    #html;//Результат загрузки
    #result={};//Объект, содержащий результат парсинга
    #url;//Адрес для закачки c учётом параметров запроса (для GET)
    #xhr;// объект XMLHttpRequest
    #status;//Статус загрузки
    #downloadCounter;//Счётчик загрузок в объекте
    #requestParameters;//Запрос к серверу
    #method;
    #callback

    /**
     * @description Класс асинхронного получения данных с сервера
     * @constructor
     * @param {String} url Адрес сервера для закачки
     * @param {String} method Метод закачки GET/POST
     * @param {String} requestParameters Данные для отправки на сервер методом POST
     * @param {String} contentType Данные для отправки на сервер методом POST
     * @param {callback} callback ссылка на callback(this), принимающий аргументом объект с результатом закачки
     */
    constructor(url, method="GET", requestParameters="", contentType="application/javascript", callback){
    //Конструктор принимает функцию
        this.#downloadCounter=0;
        this.startDownloading(url, method, requestParameters, contentType, callback );
        
    }

    async startDownloading(url, method="GET", requestParameters="", contentType="application/javascript", callback){
    //Постановка объекта на закачку данных методом POST
    //url - адрес для закачки
    //callback - функция для дальнейшего планирования действий с объектами
        this.#requestParameters=requestParameters;
        this.#method=method;
        this.#xhr=new XMLHttpRequest();
        this.#status=false;
        this.#url = method.toUpperCase()=="GET" ? url + "?" + encodeURIComponent(this.#requestParameters) : url;
        this.#xhr.open(method, this.#url, true);
        //this.#xhr.responseType=contentType;
        //body= "url="+encodeURIComponent(url);

        this.#xhr.onload=()=>{
            if(this.#xhr.status!=200){
            //Сервер вернул код ошибки
                if(this.#xhr!=404){
                //Пробуем поставить закачку повторно через 2 секунды
                    setTimeout(this.startDownloading, 2000, this.#url, this.#method, this.#requestParameters, this.#callback)
                }
            }else{
                this.#status=true;
                this.#html=this.#xhr.response;
                ++this.#downloadCounter;
                //Вызываем колбэк для обработки загруженных данных и постановки новой очереди загрузки
                callback(this);
            }   
        }

        switch (method.toUpperCase()){
            case "GET":
                this.#xhr.setRequestHeader('Content-type', contentType+'; charset=UTF-8');
                this.#xhr.send();
                break;
            case "POST":
                this.#xhr.setRequestHeader('Content-type', contentType+'; charset=UTF-8');
                this.#xhr.send(JSON.stringify(this.#requestParameters));
                break;
        }   
    }

    get json(){
        return JSON.parse(this.#html);
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
        return this.#html;
    }
    
    get downloadCounter(){
        return this.#downloadCounter;
    }

    get method(){
        return this.#method;
    }

    get requestParameters(){
        return this.#requestParameters;
    }

    eraseResult(){
    //Очищаем объект с результатами
        for(let key in this.#result) delete this.#result[key];//Обнуляем объект
        this.#html=null;
        this.#url=null;
        this.#requestParameters=null;
        this.#method=null;
    }
}