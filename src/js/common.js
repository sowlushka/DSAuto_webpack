


import {CatInfo} from './classes/CatInfo.mjs'
import ptSvg from "../static/icons/pt.svg";
import pdSvg from "../static/icons/pd.svg";
import rhSvg from "../static/icons/rh.svg";
import noPhotoJpg from "../static/images/nophoto.jpg";

const cats=[];//Массив автокатализаторных объектов

const urlPriceServer="https://infobootkatalizatory.vipserv.org/poznaj_cene/index.php";

//Исхдный запрос сайта
const queryString="po=lp&id=617&authenticationwwwId=&tryb=2&tc_css=false&tc_js=false&tc_dane=top20&tc_wyszukiwarka=true&checkSrc=katPage&sessid=&visitorId=";


let catSearchButton=document.getElementById("form__cat-search__button");
const catList=document.querySelector('.catalyst-list');



catSearchButton.onclick=()=>{
  catList.innerHTML="Ожидайте. Идёт поиск...";
  catList.style.fontSize="30px";
  const catSearchInput=document.getElementById('form__cat-search__input');
  getCatSerials(catSearchInput.value).then(()=>{//Ищем катализаторы с выбранным номером по базе данных
    let getPricePromiseArr=cats.map(el=>getPriceById(el.id));
    Promise.allSettled(getPricePromiseArr).then(()=>{//Подгружаем цены для найденных катализаторов
        createPriceCards();
    });
  });
  
  

  
}


async function getPriceById(id){
  await fetch(urlPriceServer,{
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
      });

}

async function getCatSerials(str){
//На входе функции поисковая строка
  await fetch('https://infobootkatalizatory.vipserv.org/search/search',{
    method: "POST",
    headers: {
      // значение этого заголовка обычно ставится автоматически,
      // в зависимости от тела запроса
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
          let catArr=text.split("cm_katalizator_itm");
          for(let i=1;i<catArr.length;++i){
          //Собираем информацию о катализаторах
            let id=catArr[i].match(/(?<=pokaz_cene_mobile\()\d+/)?.[0];
            if(!id)continue;
            let serial=catArr[i].match(/(?<=cm_kat_link[^>]*>)(.*?)(?=<\/a>)/)[0].replaceAll("<b>","").replaceAll("</b>","");
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
            }
          }
      });
}


function createPriceCards(){
//Создаём карточки катализаторов
    catList.innerHTML="";//Очистка от старого поиска
     catList.style.fontSize="";

    catList.style.display="flex";
    if (cats.length){
         cats.forEach(cat=>{
            const img=`
                <a href="${cat.url}" target="_blank">
                    <img src="${cat.img?cat.img:noPhotoJpg}" alt="${cat.serial}">
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
                    <div class="catalyst-card">
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
                        <div class="catalyst-metals">
                            ${ptImg}
                            ${pdImg}
                            ${rhImg}
                        </div>
                        <div class="catalyst-price">
                            Цена: <span class="catalyst-price-value">${cat.price}$</span>
                        </div>
                    </div>
            `;
            catList.insertAdjacentHTML('beforeend', html);
        });


    }
    else{
        catList.innerHTML="Ничего не найдено";
    }
   
}