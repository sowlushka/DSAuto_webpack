export class CatInfo{
    #catId;//id катализатора
    #brand;//Марка авто
    #serial;//серийный номер
    #url;//адрес на сайте
    #img;//ссылка на изображение
    #type;//тип материала
    #mass;//Масса
    #metals;//Объект с перечнем металлов
    #price;//Массив объектов по ценам на автокаты за определённые даты

    
    constructor(id, brand, serial, url, img, type, mass, metals, price){
        this.#catId=id;
        this.#brand=brand;
        this.#serial=serial;
        this.#url=url;
        this.#img=img;
        this.#type=type;
        this.#mass=mass;
        this.#metals=metals;
        this.#price=price;
    }

    get id(){
        return this.#catId;
    }

    get brand(){
        return this.#brand;
    }

    get serial(){
        return this.#serial;
    }

    get url(){
        return this.#url;
    }

    get img(){
        return this.#img;
    }

    get type(){
        return this.#type;
    }

    get mass(){
        return this.#mass;
    }

    get metals(){
        return this.#metals;
    }

    get price(){
        return this.#price;
    }

    set price(value){
        this.#price=value;
    }

    
}