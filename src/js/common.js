
import * as constants from './const.js';//Подгружаем константы проекта
import { cats } from './global-var.js';//Модуль глобальных переменных

import {CatInfo} from './classes/CatInfo.mjs';
import { Downloader } from './classes/Downloader';//Класс докачки информации с индивидуальных страничек автокатов
import { createPriceCard, showMessage, clearCatalystList, 
  resetFilters, createBrandSelectionData, setMassToCard } from './libs-js/html-funcs.js';//Функции отрисовки DOM

import { catSearchButton, metallsCheckboxes, vehicleBrands, searchAlert, catSearchInput, catList } from './libs-js/html-funcs.js';


vehicleBrands.addEventListener('change',sortTotal);

metallsCheckboxes.forEach(input=>{
  input.addEventListener('change',sortTotal);
});



catSearchButton.onclick=async ()=>{
//Обработка клика по кнопке "Найти"
  clearCatalystList();
  searchAlert.style.display="block";
  cats.length=0;
  resetFilters();
  await getCatSerials(catSearchInput.value);

  if(!cats.length){
    catList.innerHTML="НИЧЕГО НЕ НАЙДЕНО";
  }else{
    showMessage("Найдено "+cats.length+" позиций");
  }


  createBrandSelectionData(cats);//Заполняем <Select> производителями авто

  getMassfromPolandServer(cats);//Для каждого катализатора подгружаем данные о массе

}


async function getCatSerials(str){
//Функция обращается для поиска кататализаторов с серийным номером, включающий в себя часть строки str
//Через глобальный массив cats[] возвращает объекты катализаторов, соответствующие данному строковому шаблону

  await fetch('https://infobootkatalizatory.vipserv.org/search/search',{
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "accept": "*/*"
    },
    body: "szukaj="+encodeURIComponent(str)+"&template=mobile&brand=all",
    // или URL с текущего источника
    referer: "https://infobootkatalizatory.vipserv.org/",
    referrerPolicy: "origin-when-cross-origin",
    mode: "cors",
    cache: "default",
    redirect: "follow"
  })
      .then(response=>
          response.text())
      .then((text)=>{
          //Парсим информацию о катализаторах
          searchAlert.style.display="";
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
            let newCat=new CatInfo(Number(id),brand,serial,url,img,undefined,undefined,metalls,undefined);
            if (cats.every(cat=>cat.id!=newCat.id)){
              cats.push(newCat);
              createPriceCard(newCat);
            }
          }
      });
}


function selectMetalls(catalysts){
//Фильтр данных по наличию металлов
 let ptCheck=document.getElementById("metalls__pt").checked;
 let pdCheck=document.getElementById("metalls__pd").checked;
 let rhCheck=document.getElementById("metalls__rh").checked;
 if(!(ptCheck || pdCheck || rhCheck)){
//Если не один хим. элемент не отмечен, фильтрацию не делаем
   return catalysts
 }
 return catalysts.filter(cat=>
          cat.metals.pt == ptCheck && cat.metals.pd == pdCheck && cat.metals.rh == rhCheck
        );
}

function selectBrand(catalysts){
//Фильтр данных по бренду производителя авто
  let brand=vehicleBrands.value;
  if(!brand){
    return catalysts;
  } 
  return catalysts.filter(cat=>cat.brand==brand);
}

function sortTotal(){
//Итоговая функция сортироки по выставленным фильтрам
  clearCatalystList();
  let filteredCatalysts=selectMetalls(cats);//Фильтруем по набору металлов в катализаторах
  filteredCatalysts=selectBrand(filteredCatalysts);

  filteredCatalysts.forEach(cat=>createPriceCard(cat));
}



async function getMassfromPolandServer(cats){
  if (cats.length<=constants.maxDownloadingSites){
  //Ставим все катализаторы на докачку массы

    cats.forEach(cat=>{
        new Downloader(cat.url, (site)=>{
        //Подгрузили массу. Добавляем данные к объекту
        cat.mass=site.result.mass;
        setMassToCard(cat.id, cat.mass);//Заносим массу в карточку катализатора
      });
    });

  } else {
  //Ставим на закачку массы первые maxDownloadingSites катализаторов
    let sites=Array(constants.maxDownloadingSites);//Массив объектов для закачки массы

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

      //Ищем катализатор, для которого масса ещё не закачана и который не стоит в очереди на закачку массы
      let newCat=cats.find(findingCat=>!findingCat.mass && sites.every(thisSite=>thisSite.url!=findingCat.url));
      if(newCat){
        site.startDownloading(newCat.url, readDataAndNewDownloading);
      } else {
      //Закачка массы для всех катализаторов завершена

      }
      
    }

    for(let i=0;i<constants.maxDownloadingSites;++i){
      sites[i]=new Downloader(cats[i].url,readDataAndNewDownloading);
    }
  }

}