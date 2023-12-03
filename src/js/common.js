
import * as constants from './const.js';//Подгружаем константы проекта
import { cats } from './global-var.js';//Модуль глобальных переменных

import { getDSAutoCatSerials } from './libs-js/network.js';
import { Downloader } from './classes/Downloader';//Класс докачки информации с индивидуальных страничек автокатов

import { showMessage, clearCatalystList, 
  resetFilters, createBrandSelectionData, setMassToCard } from './libs-js/html-funcs.js';//Функции отрисовки DOM

import { catSearchButton, metallsCheckboxes, vehicleBrands, searchAlert, catSearchInput, catList } from './libs-js/html-funcs.js';
import { sortTotal } from './libs-js/filters.js';
import { WorkProgress } from './classes/WorkProgress.mjs';//Класс отображения прогресса

vehicleBrands.addEventListener('change',sortTotal);


metallsCheckboxes.forEach(input=>{
//Вешаем фильтры выбора металлов
  input.addEventListener('change',sortTotal);
});



catSearchButton.onclick=async ()=>{
//Обработка клика по кнопке "Найти"
  clearCatalystList();
  searchAlert.style.display="block";
  searchAlert.style.background="";
  searchAlert.innerText="Ожидайте. Идёт поиск...";
  cats.length=0;
  resetFilters();

  let searchStatus={};
  searchStatus[constants.company.DSAuto]=true;//Поиск по катализаторам DSAuto активен
  searchStatus[constants.company.Ecotrade]=true;//Поиск по катализаторам Ecotrade активен

  getDSAutoCatSerials(catSearchInput.value).
  then(()=>{
    searchAlert.style.display="";
    if(!cats.length){
      catList.innerHTML="НИЧЕГО НЕ НАЙДЕНО";
    }else{
      showMessage("Найдено "+cats.length+" позиций");
    }


    createBrandSelectionData(cats);//Заполняем <Select> производителями авто

    getMassfromPolandServer(cats);//Для каждого катализатора подгружаем данные о массе
  });

  //getEcotradeCatSerials(catSearchInput.value).then

}





async function getMassfromPolandServer(cats){
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