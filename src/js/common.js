
import * as constants from './const.js';//Подгружаем константы проекта

import {CatInfo} from './classes/CatInfo.mjs';
import { Downloader } from './classes/Downloader';

//Изображения проекта
import ptSvg from "../static/icons/pt.svg";
import pdSvg from "../static/icons/pd.svg";
import rhSvg from "../static/icons/rh.svg";
import noPhotoJpg from "../static/images/nophoto.jpg";

const cats=[];//Массив автокатализаторных объектов

const urlPriceServer="https://infobootkatalizatory.vipserv.org/poznaj_cene/index.php";




const catSearchButton=document.getElementById("form__cat-search__button");
const catList=document.querySelector('.catalyst-list');
const searchAlert=document.querySelector(".search-alert");
const catSearchInput=document.getElementById('form__cat-search__input');
const messageAlert=document.getElementById('alert-message-wrapper');
const vehicleBrands=document.querySelector('.vehicle-brands');
const metallsCheckboxes=document.querySelectorAll('input[type="checkbox"][id^="metalls__"]');


vehicleBrands.addEventListener('change',sortTotal);

metallsCheckboxes.forEach(input=>{
  input.addEventListener('change',sortTotal);
});



catSearchButton.onclick=async ()=>{
  clearCatalystList();
  searchAlert.style.display="block";
  cats.length=0;
  resetFilters();
  await getCatSerials(catSearchInput.value);
  createBrandSelectionData(cats);//Заполняем <Select> производителями авто

  getMassfromPolandServer(cats);//Для каждого катализатора подгружаем данные о массе
  

  
}


async function getPriceById(id){
  const price=await fetch(urlPriceServer,{
    method: "POST",
    headers: {
      // значение этого заголовка обычно ставится автоматически,
      // в зависимости от тела запроса
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "accept": "application/json, text/javascript, */*; q=0.01"
    },
    body: "po=lp&id="+id+"&tryb=3&tc_dane=top1000&checkSrc=katPage&",
    // или URL с текущего источника
    referer: "https://infobootkatalizatory.vipserv.org/",
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
          if(!cats.length){
            catList.innerHTML="НИЧЕГО НЕ НАЙДЕНО";
          }else{
            showMessage("Найдено "+cats.length+" позиций");
          }
      });
}


function createPriceCard(cat){
//Создаём карточку катализатора
    catList.style.fontSize="";

    catList.style.display="flex";

      //Изображение катализатора   
      const img=`
          <a href="${cat.url}" target="_blank">
              <img class="catalyst-card-photo" src="${cat.img?cat.img:noPhotoJpg}" alt="${cat.serial}">
          </a>
          `;

      const ptImg=!cat.metals.pt?"":`
          <img src="${ptSvg}" alt="Pt">
      `;

      const pdImg=!cat.metals.pd?"":`
          <img src="${pdSvg}" alt="Pd">
      `;

      const rhImg=!cat.metals.rh?"":`
          <img src="${rhSvg}" alt="Rh">
      `;

      let html=`
              <div class="catalyst-card" id="catalyst-card-${cat.id}">
                  <div class="card-header">
                      <h3>
                          ${cat.brand}
                      <h3>
                      <h5>
                          <a href="${cat.url}" target="_blank">
                              ${cat.serial}
                          </a>
                      </h5>
                  </div>
                  ${img}
                  <div class="catalyst-mass">${cat.mass?"Масса: "+mass+" кг":""}</div>
                  <div class="catalyst-metals">
                      ${ptImg}
                      ${pdImg}
                      ${rhImg}
                  </div>
                  <div class="catalyst-price" id="catalyst-price-${cat.id}">
                      <button id="card-price-${cat.id}">Показать цену</button>
                  </div>
              </div>
      `;
      catList.insertAdjacentHTML('beforeend', html);
      document.getElementById(`card-price-${cat.id}`).addEventListener('click',async(e)=>{
        let id=e.target.id.match(/\d+/)[0];
        let price = await getPriceById(id)
        document.querySelector("#catalyst-price-"+id).innerHTML=`
          Цена: ${price}$
        `;
      });
   
}

function showMessage(str){
  messageAlert.style.display="flex";
  messageAlert.querySelector("div").innerHTML=str;
  //Вычисляем ширину окна
  let vw=window.innerWidth;
  let elWidth=messageAlert.offsetWidth;
  messageAlert.style.left=vw/2-(elWidth/2);
}

document.getElementById('alert-message-button').onclick=()=>{
  messageAlert.style.display="";
}



function resetFilters(){
//Сброс фильтров
  metallsCheckboxes.forEach(input=>{
    input.checked=false;
  });
  vehicleBrands.value="";

}


function clearCatalystList(){
//Очистка div .catalyst-list от данных
  const list=document.querySelector('.catalyst-list');
  for(;list.childNodes.length;){
    list.childNodes[0].remove();
  }
}

function createBrandSelectionData(cats){
//Создать элемент фильтра: Селект с брендами авто
  let brands=[];
  cats.forEach(cat=>{
    if(brands.every(brand=>cat.brand!=brand))brands.push(cat.brand);
  });
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
      }
      
    }

    for(let i=0;i<constants.maxDownloadingSites;++i){
      sites[i]=new Downloader(cats[i].url,readDataAndNewDownloading);
    }
  }

}

function setMassToCard(id, mass){
//Заносим массу катализатора id в html-карточку катализатора
  let card=document.getElementById("catalyst-card-"+id);
  if(!card)return;//карточка скрыта условими сортировки
  let massDiv=card.querySelector(".catalyst-mass");
  massDiv.style.display="block";
  massDiv.innerText="Масса: "+mass+" кг";
}