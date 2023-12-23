//отрисовка html-блока main


//Изображения проекта
import ptSvg from "../../../static/icons/pt.svg";
import pdSvg from "../../../static/icons/pd.svg";
import rhSvg from "../../../static/icons/rh.svg";
import { sortTotal, resetFilters } from '../../libs-js/filters.js';
import { clearCatalystList, createBrandSelectionData } from "../../libs-js/html-funcs.js";
import { getDSAutoCatSerials, getMassfromDSAuto } from "../../libs-js/network/dsauto.js";
import { cats } from "../../global-var.js";

export function createSearchForm(){
     const htmlForm=`
                <label for="cat-search">Введите номер катализатора:</label>
                <input type="text" id="form__cat-search__input" placeholder="gm18" required>
                <button type="button" id="form__cat-search__button">Найти</button>
                <div class="form__sort__params">
                    <div class="form__metalls__checkbox__container">
                    <input type="checkbox" name="metalls_pt" id="metalls__pt"><label for="metalls__pt"><img src="./static/icons/pt.svg" alt="Pt"></label>
                    </div>
                    <div class="form__metalls__checkbox__container">
                    <input type="checkbox" name="metalls_pd" id="metalls__pd"><label for="metalls__pd"><img src="./static/icons/pd.svg" alt="Pd"></label>
                    </div>
                    <div class="form__metalls__checkbox__container">
                    <input type="checkbox" name="metalls_rh" id="metalls__rh"><label for="metalls__rh"><img src="./static/icons/rh.svg" alt="Rh"></label>
                    </div>
                    <select class="vehicle-brands" name="brand"></select>
                </div>
    `;
    const form=document.createElement('form');
    form.classList.add('form__cat-search');
    form.insertAdjacentHTML('afterbegin', htmlForm);

    const vehicleBrands=form.querySelector('.vehicle-brands');
    vehicleBrands.addEventListener('change', sortTotal);

    //события выбора фильтров Pt, Pd, Rh
    const metallsCheckboxes=form.querySelectorAll('input[type="checkbox"][id^="metalls__"]');

    metallsCheckboxes.forEach(input=>{
    //Вешаем фильтры выбора металлов
        input.addEventListener('change',sortTotal);
    });

    form.querySelector('#form__cat-search__button').addEventListener('click', startSearch)
    
    return form;
  }



  async function startSearch(){
    //Обработка клика по кнопке "Найти"
    clearCatalystList();
    const searchAlert=document.querySelector('.search-alert');
    const catSearchInput=document.querySelector('#form__cat-search__input');
    searchAlert.style.display="block";
    searchAlert.style.background="";
    searchAlert.innerText="Ожидайте. Идёт поиск...";
    cats.length=0;
    resetFilters();

    let downloadPromise=[];
    downloadPromise.push(getDSAutoCatSerials(catSearchInput.value));
   
    
    await Promise.allSettled(downloadPromise);//Ожидаем завершение закачки катализаторов от всех страниц

    createBrandSelectionData(cats);//Заполняем <Select> производителями авто

}