
import * as constants from './const.js';//Подгружаем константы проекта
import { cats } from './global-var.js';//Модуль глобальных переменных

//Подключение сетевых функций
import { getDSAutoCatSerials, getMassfromDSAuto} from './libs-js/network/dsauto.js';
import { getEcotradeCatSerials } from './libs-js/network/ecotrade.js';

import { showMessage, clearCatalystList, 
  resetFilters, createBrandSelectionData, setMassToCard } from './libs-js/html-funcs.js';//Функции отрисовки DOM

import { catSearchButton, metallsCheckboxes, vehicleBrands, searchAlert, catSearchInput, catList } from './libs-js/html-funcs.js';
import { sortTotal } from './libs-js/filters.js';


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
    if(cats.length && cats.some(cat=>cat.company==constants.company.DSAuto)){
      //Массив катализаторов не пустой и среди них есть хотя бы один польский. Можно подгружать данные о массе
      getMassfromDSAuto(cats);
    }
  });

  getEcotradeCatSerials(catSearchInput.value).then

}