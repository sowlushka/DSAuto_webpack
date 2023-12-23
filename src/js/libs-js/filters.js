//Модуль фильтров

import { cats } from "../global-var";
import { clearCatalystList, createPriceCard } from "./html-funcs.js";

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
  let brand=document.querySelector('.form__cat-search .vehicle-brands').value;
  if(!brand){
    return catalysts;
  } 
  return catalysts.filter(cat=>cat.brands.some(el=>el==brand));
}

export function sortTotal(){
//Итоговая функция сортироки по выставленным фильтрам
  clearCatalystList();
  let filteredCatalysts=selectMetalls(cats);//Фильтруем по набору металлов в катализаторах
  filteredCatalysts=selectBrand(filteredCatalysts);

  filteredCatalysts.forEach(cat=>createPriceCard(cat));
}

export function resetFilters(){
//Сброс фильтров на форме сайта
  const metallsCheckboxes=document.querySelectorAll('input[type="checkbox"][id^="metalls__"]');
  metallsCheckboxes.forEach(input=>{
    input.checked=false;
  });

  document.querySelector('.form__cat-search .vehicle-brands').value="";

}