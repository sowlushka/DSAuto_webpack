import * as constants from "../../const.js";
import { cats } from "../../global-var.js"; //Модуль глобальных переменных
import {CatInfo} from "../../classes/CatInfo.mjs";
import { createPriceCard } from "../html-funcs.js";

export async function getEcotradeCatSerials(searchString, url=constants.urlEcotradeSearchServer){
    await fetch(url + encodeURIComponent(searchString),{
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "accept": "*/*"
    },
    referrerPolicy: "origin-when-cross-origin",
    mode: "cors",
    cache: "default",
    redirect: "follow"
  })
      .then(response=>
          response.text())
      .then((text)=>{

        let json=text.match(/(?<=let products = )((\{.*?\})|(\[.+?\]))(?=;)/su)?.[0];
        if(!json){
            debugger;
        }
        let ecotradeJSONData=JSON.parse(json);//Может вернуться массив, а может - перечень объектов
        
       
        //Получаем массив блоков с данными о катализаторах Ecotrade
        let ecotrCatsData=Array.from(text.matchAll(/<div[^>]+?class="shadow.+?(<a.+?)<strong/gsu)).map(el=>el[1]);
        let ecotradeCurrentPosition=0;

        //
        ecotrCatsData.forEach(dataText=>{
            //Проверяем, есть ли в JSON файле данные для текущего катализатора
            let id, price;
            let product=ecotradeJSONData[ecotradeCurrentPosition]
            if(product){
                id=Number(product.id);
                price=Math.round(product.price*10000)/10000;
            }
            
            //Считываем общую информацию о катализаторе с карточки
            let brands=Array.from(dataText.matchAll(/carbrand.+?title="(.+?)"/sug)).map(el=>el[1]);
            let serial=dataText.match(/src.+?<small.*?text-truncate[^>]*?>(.+?)<\/small>/su)[1];
            serial=serial.replaceAll(" ","");
            let url=constants.urlEcotradeSearchServer.match(/^.+?\.com/)+dataText.match(/(?<=href=").*?(?=")/su)[0];
            let img=dataText.match(/(?<=url\(').*?(?=')/su)[0];
            let newCat=new CatInfo(id,undefined,serial,url,img,undefined,undefined,undefined,price, constants.company.Ecotrade);
            newCat.addBrand(brands);
            cats.push(newCat);
            createPriceCard(newCat);
            ++ecotradeCurrentPosition;
        });
        
        let pagesLink=text.match(/pagination.*(<li.*?href="(.*?)".*?<\/ul)+?.*?<section/su)?.[2];
        let pagesCount=pagesLink?.match(/\d+/)?.[0];
        let urlCount=url?.match(/\d+/)?.[0];
        if(urlCount==pagesCount || urlCount==constants.maxEcotradeDownloadPages){
            console.log("Зашли на уровень самой глубокой загрузкии "+urlCount);
            console.log("Всего в массиве " + cats.length + " катализаторов");
            console.log(cats);
            return;
        }
        ++urlCount;
        if(pagesLink){
            let newUrl=constants.urlEcotradeSearchServer.match(/^.+?\.com/) + pagesLink.replace(/\d+/,urlCount);
            //Поисковая строка уже вшита в URL, поэтому не прописываем её
            getEcotradeCatSerials("", newUrl);
        }
        
      });


}