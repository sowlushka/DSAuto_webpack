//Библиотеки отрорисовки элементов DOM


import { getDSAutoPriceById } from "./network/dsauto";//Библиотека функций работы с сетевыми запросами
import { getEcotradePrice } from "./network/ecotrade.js";
import {company} from "../const.js";
import { cats } from "../global-var";


//Изображения проекта
import ptSvg from "../../static/icons/pt.svg";
import pdSvg from "../../static/icons/pd.svg";
import rhSvg from "../../static/icons/rh.svg";
import noPhotoJpg from "../../static/images/nophoto.jpg";


//Элементы DOM
export const catSearchButton=document.getElementById("form__cat-search__button");
export const catList=document.querySelector('.catalyst-list');
export const searchAlert=document.querySelector(".search-alert");
export const catSearchInput=document.getElementById('form__cat-search__input');
export const vehicleBrands=document.querySelector('.vehicle-brands');
export const metallsCheckboxes=document.querySelectorAll('input[type="checkbox"][id^="metalls__"]');
const messageAlert=document.getElementById('alert-message-wrapper');

/**
 * Получить карточку цены катализатора
 * @param {Object} cat Объект катализатора
 */
export function createPriceCard(cat){
//Создаём карточку катализатора
  catList.style.fontSize="";

  catList.style.display="flex";

  //Изображение катализатора
  const img=`
  <a href="${cat.url}" target="_blank">
      <img class="catalyst-card-photo" src="${cat.img?cat.img:noPhotoJpg}" alt="${cat.serial}">
  </a>
  `;

  const ptImg=!cat.metals?.pt?"":`
  <img src="${ptSvg}" alt="Pt">
  `;

  const pdImg=!cat.metals?.pd?"":`
  <img src="${pdSvg}" alt="Pd">
  `;

  const rhImg=!cat.metals?.rh?"":`
  <img src="${rhSvg}" alt="Rh">
  `;

  let id;
  switch(cat.company){
    case company.DSAuto:
      id=company.DSAuto + cat.id;
      break;
    case company.Ecotrade:
      id=company.Ecotrade+cats.findIndex(element=>cat.url==element.url);
      break;
  }

  const priceElement=cat.price?`Цена: ${cat.price}$`:`<button id="card-price-${id}">Показать цену</button>`;

  let html=`
  <div class="catalyst-card" id="catalyst-card-${id}">
      <div class="card-header">
          <h3>
              ${cat.brands.join(", ")}
              <h3>
                  <h5>
                      <a href="${cat.url}" target="_blank">
                          ${cat.serial}
                      </a>
                  </h5>
      </div>
      ${img}
      <div class="catalyst-mass" ${cat.mass?'style="display: block"':""}>${cat.mass?"Масса: "+cat.mass+" кг":""}</div>
      <div class="catalyst-metals">
          ${ptImg}
          ${pdImg}
          ${rhImg}
      </div>
      <div class="catalyst-price" id="catalyst-price-${id}">
          ${priceElement}
      </div>
  </div>
  `;
  catList.insertAdjacentHTML('beforeend', html);

  //Событие на кнопку цены
  let getPriceListener;//Функция обработки нажатия кнопки получения цены
  switch(cat.company){
    case company.DSAuto:
        getPriceListener=getPriceListener_dsauto;
        break;
    case company.Ecotrade:
        getPriceListener=getPriceListener_ecotrade;
        break;
  }

  document.getElementById(`card-price-${id}`)?.addEventListener('click',getPriceListener);

}


export function showMessage(str){
//Вывод немодального сообщения в окно браузера (аналог AlertS)
  messageAlert.style.display="flex";
  messageAlert.querySelector("div").innerHTML=str;

  //Вычисляем ширину окна
  let vw=window.innerWidth;
  let elWidth=messageAlert.offsetWidth;
  messageAlert.style.left=vw/2-(elWidth/2);
}

export function clearCatalystList(){
//Очистка div .catalyst-list от данных
  const list=document.querySelector('.catalyst-list');
  for(;list.childNodes.length;){
    list.childNodes[0].remove();
  }
}

document.getElementById('alert-message-button').onclick=()=>{
  messageAlert.style.display="";
}


export function resetFilters(){
//Сброс фильтров на форме сайта
  metallsCheckboxes.forEach(input=>{
    input.checked=false;
  });
  vehicleBrands.value="";

}


export function createBrandSelectionData(cats){
//Создать элемент фильтра: Селект с брендами авто
  let uniqBrands=new Set();
  cats.forEach(cat=>{
    cat.brands.forEach(thisBrand=>uniqBrands.add(thisBrand));
  });

  let brands=Array.from(uniqBrands);

  brands.sort((a,b)=>a.localeCompare(b));
  let html=`<option></option>
    `;
  brands.forEach(brand=>{
    html+=`
      <option>${brand}</option>
    `;
  });
  vehicleBrands.innerHTML=html;
}


export function setMassToCard(id, mass){
//Заносим массу катализатора id в html-карточку катализатора
  let card=document.getElementById("catalyst-card-"+ company.DSAuto + id);
  if(!card)return;//карточка скрыта условими сортировки
  let massDiv=card.querySelector(".catalyst-mass");
  massDiv.style.display="block";
  massDiv.innerText="Масса: "+mass+" кг";
}


/**
 * Слушатель события клика по кнопке "Получить цену" для катализатора DSAuto
 * @param {Object} e событие
 */
export function getPriceListener_dsauto(e){
    let id=e.target.id.match(/\d+/)[0];
    getDSAutoPriceById(id).
    then(price=>
      {
        document.getElementById('catalyst-price-'+company.DSAuto+id).innerHTML=`
        Цена: ${price}$
        `;
      });
}


/**
 * Слушатель события клика по кнопке "Получить цену" для катализатора Ecotrade
 * @param {Object} e событие
 */
export function getPriceListener_ecotrade(e){
    let id=e.target.id.match(/\d+/)[0];
    let url=cats[id].url;
    getEcotradePrice(url).
     then(price=>
      {
        document.getElementById('catalyst-price-'+company.Ecotrade+id).innerHTML=`
        Цена: ${price}$
        `;
      });
}