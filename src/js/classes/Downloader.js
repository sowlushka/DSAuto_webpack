import * as constants from "../const.js";

export class Downloader{
    #html;//Результат загрузки
    #result={};//Объект, содержащий результат парсинга
    #url;//Адрес для закачки
    #xhr;// объект XMLHttpRequest
    #status;//Статус загрузки
    #downloadCounter;//Счётчик загрузок в объекте
    #callback

    constructor(url, callback){
    //Конструктор принимает функцию
        this.#downloadCounter=0;
        this.startDownloading(url,callback);
        
    }

    async startDownloading(url, callback){
    //Постановка объекта на закачку данных методом POST
    //url - адрес для закачки
    //callback - функция для дальнейшего планирования действий с объектами
        this.#xhr=new XMLHttpRequest();
        this.#status=false;
        this.#url=url;
        this.#xhr.open("post", constants.serverVPN,true);
        this.#xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.#xhr.responseType="text";
        let body= "url="+encodeURIComponent(url);

        this.#xhr.onload=()=>{
            if(this.#xhr.status!=200){
            //Сервер вернул код ошибки
                if(this.#xhr!=404){
                //Пробуем поставить закачку повторно через 0.5 секунд
                    setTimeout(this.startDownloading,500,this.#url,this.#callback)
                }
            }else{
                this.#status=true;
                this.#html=this.#xhr.response;
                this.#parse();//Парсим ответ
                ++this.#downloadCounter;
                //Вызываем колбэк для обработки загруженных данных и постановки новой очереди загрузки
                callback(this);
            }
            
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
        return this.#html;
    }
    
    get downloadCounter(){
        return this.#downloadCounter;
    }

    eraseResult(){
    //Очищаем объект с результатами
        for(let key in this.#result) delete this.#result[key];//Обнуляем объект
        this.#html=null;
        this.#url=null;
    }
}