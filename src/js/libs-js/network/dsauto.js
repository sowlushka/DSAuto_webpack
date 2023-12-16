//Библиотека функций работы с сетевыми запросами




import { cats } from "../../global-var.js"; //Модуль глобальных переменных
import {CatInfo} from "../../classes/CatInfo.mjs";
import { createPriceCard } from "../html-funcs.js";
import * as constants from "../../const.js";
import { Downloader } from "../../classes/Downloader.js";
import { WorkProgress } from "../../classes/WorkProgress.mjs";//Класс отображения прогресса

export async function getPriceById(id){
  const price=await fetch(constants.urlPriceServer,{
    method: "POST",
    headers: {
      // значение этого заголовка обычно ставится автоматически,
      // в зависимости от тела запроса
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "accept": "application/json, text/javascript, */*; q=0.01"
    },
    body: "po=lp&id="+id+"&tryb=3&tc_dane=top1000&checkSrc=katPage&",

    referrerPolicy: "origin-when-cross-origin",
    mode: "cors",
    cache: "default",
    redirect: "follow"
  })
      .then(response=>
          response.json())
      .then((json)=>{
        let cat=cats.find(cat=>cat.id==id);
        cat.price=json[id].pokaz_cene_historia[json[id].pokaz_cene_historia.length-1].price_usd;
        return cat.price;
      });
      return price;
}


export async function getDSAutoCatSerials(str){
//Функция обращается для поиска кататализаторов с серийным номером, включающий в себя часть строки str
//Через глобальный массив cats[] возвращает объекты катализаторов, соответствующие данному строковому шаблону

  await fetch(constants.urlDSAutoSearchServer,{
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "accept": "*/*"
    },
    body: "szukaj="+encodeURIComponent(str)+"&template=mobile&brand=all",
    referrerPolicy: "origin-when-cross-origin",
    mode: "cors",
    cache: "default",
    redirect: "follow"
  })
      .then(response=>
          response.text())
      .then((text)=>{
          //Парсим информацию о катализаторах
          let catArr=text.split("cm_katalizator_itm");
          for(let i=1;i<catArr.length;++i){
          //Собираем информацию о катализаторах
            let id=catArr[i].match(/(?<=pokaz_cene_mobile\()\d+/)?.[0];
            if(!id)continue;
            let serial=catArr[i].match(/(?<=cm_kat_link[^>]*>)(.*?)(?=<\/a>)/)[0].replaceAll("<b>","").replaceAll("</b>","");
            serial=serial.replaceAll("/"," / ");
            let brand=catArr[i].split("</tr>")[0].split("<td")[2].match(/(?<=>).*?(?=<)/)[0];
            brand=brand.replace(/VOLKSWAGEN\/AUDI\/SKODA\/SEAT/i, "VAG");
            let url=catArr[i].match(/(?<=cm_kat_link.*?href=").*?(?=")/)[0];
            let img=catArr[i].match(/href=".*?\.jpe?g/)
            if (img)img=img[0].replace('href="',"");//.replace("width300","width1600");
            const metalls={};
            metalls.pt=catArr[i].match(/(?<=Zawiera metale.+?)PT/)?true:false;
            metalls.pd=catArr[i].match(/(?<=Zawiera metale.+?)PD/)?true:false;
            metalls.rh=catArr[i].match(/(?<=Zawiera metale.+?)RH/)?true:false;
            let newCat=new CatInfo(Number(id),brand,serial,url,img,undefined,undefined,metalls,undefined, constants.company.DSAuto);
            if (cats.every(cat=>cat.id!=newCat.id)){
              cats.push(newCat);
              createPriceCard(newCat);
            }
          }
      });
}




export async function getMassfromDSAuto(cats){
//Функция докачки массы со страниц катализаторов польского сервера DSAuto

  let progress=new WorkProgress(searchAlert, cats.length, "Закачка массы...");//Создаём объект класса прогресса
  let massSitesCount=cats.reduce((acc, cat)=>(cat.company==constants.company.DSAuto && !cat.mass)?acc+1:acc,0);//Кол-во катализаторов фирмы DSAuto без массы

  if (massSitesCount<=constants.maxDownloadingSites){
  //Ставим все катализаторы одновременно на докачку массы
    cats.forEach((cat, index)=>{
        if(cat.company==constants.company.DSAuto && !cat.mass){
        //Катализатор от фирмы DSAuto без массы. Ставим на закачку
          new Downloader(cat.url, (site)=>{
            //Подгрузили массу. Добавляем данные к объекту
            cat.mass=site.result.mass;
            setMassToCard(cat.id, cat.mass);//Заносим массу в карточку катализатора
            let progressMessage=`Докачка массы: ${index+1} из ${massSitesCount}`;
            progress.showProgress(progressMessage,index+1);
          });
        }
        
    });

  } else {
  //Ставим на закачку массы первые maxDownloadingSites катализаторов
    let sites=Array(constants.maxDownloadingSites);//Массив объектов для закачки массы

    //---------------------------------------------------------------------------------
    // Подготавливаем колбэк для обработки закачки и постановки новой закачки в очередь
    let readDataAndNewDownloading=function(site){
    //Функция считывает результат закачки и ставит в очередь новую закачку в том же объекте
    //site - объект класса Downloader, выполнивший закачку

      //C одинаковым url может быть несколько катализаторов с разным id. Прописываем им всем массу
      cats.forEach(cat=>{
        if(cat.url==site.url){
        //Получили катализаторы, для которых выполнена закачка
          cat.mass=site.result.mass;
          setMassToCard(cat.id, cat.mass);//Заносим массу в карточку катализатора
        }
      });

      site.eraseResult();//Сброс закачанных данных в объекте

      //Отображаем прогресс
        let currValue=cats.reduce((acc,curr,indx)=>cats[indx].mass?acc+1:acc,0);
        let progressMessage=`Докачка массы: ${currValue} из ${cats.length}`;
        progress.showProgress(progressMessage,currValue);

      //Ищем катализатор, для которого масса ещё не закачана и который не стоит в очереди на закачку массы
      let newCat=cats.find(findingCat=>
        findingCat.company==constants.company.DSAuto && !findingCat.mass && sites.every(thisSite=>thisSite.url!=findingCat.url));

      if(newCat){
        site.startDownloading(newCat.url, readDataAndNewDownloading);
      } else if(!cats.find(findingCat=>!findingCat.mass)){
      //Все массы закачаны
        progress.close();
      }
    }//--------------------Конец колбэка ------------------------------------------------
    
    //Ставим закачку
    for(let i=0;i<constants.maxDownloadingSites;++i){
      let newCat=cats.find(findingCat=>
        findingCat.company==constants.company.DSAuto && !findingCat.mass && sites.every(thisSite=>thisSite.url!=findingCat.url));

      sites[i]=new Downloader(newCat.url,readDataAndNewDownloading);
    }
  }

}