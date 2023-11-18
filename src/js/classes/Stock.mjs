//Класс биржевых цен на автокатализаторы
export class Stock{
    #date;//Время, на которое актуальная информация
    #pt;//Биржевая цена за за Pt
    #pd;//Биржевая цена за Pd
    #rh;//Биржевая цена за Rh
    constructor(date, pt, pd, rh){
        this.#date=date;
        this.#pt=pt;
        this.#pd=pd;
        this.#rh=rh;
    }
}