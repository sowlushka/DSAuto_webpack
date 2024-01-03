import { brandsForChange } from "../brandsForChange.js";

export class CatInfo{
    #catId;//id катализатора
    #brands;//Марка авто
    #serial;//серийный номер
    #url;//адрес на сайте
    #img;//ссылка на изображение
    #type;//тип материала
    #mass;//Масса
    #metals;//Объект с перечнем металлов
    #price;//Массив объектов по ценам на автокаты за определённые даты
    #company;//Владелец сайта

    
    constructor(id, brand, serial, url, img, type, mass, metals, price, company){
        this.#catId=id;
        this.#brands=new Set()
        if(brand) this.addBrand(brand);
        this.#serial=serial;
        this.#url=url;
        this.#img=img;
        this.#type=type;
        this.#mass=mass;
        this.#metals=metals;
        this.#price=price;
        this.#company=company;
    }

    get id(){
        return this.#catId;
    }

    get brands(){
        return Array.from(this.#brands);
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

    get company(){
        return this.#company
    }

    set price(value){
        this.#price=value;
    }

    set mass(value){
        this.#mass=value;
    }

    addBrand(brand){

        if (Array.isArray(brand)){
            brand.forEach(el=>{
                let correctBrand=this.#editBrand(el);
                this.#brands.add(correctBrand);
            });
            
        }else{
            let correctBrand=this.#editBrand(brand);
            this.#brands.add(correctBrand);
        }
    }
    
    #editBrand(brand){
        let correctBrand=brand.toUpperCase();
        correctBrand=brandsForChange.find(obj=>obj.source.some(el=>el.toUpperCase()==correctBrand))?.brand??correctBrand;

        return correctBrand;
    }

}