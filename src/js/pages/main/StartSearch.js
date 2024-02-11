import { clearCatalystList, createBrandSelectionData } from "../../libs-js/html-funcs.js";
import {resetFilters } from '../../libs-js/filters.js';
import { cats } from "../../global-var.js";
import { getDSAutoCatSerials, getMassfromDSAuto } from "../../libs-js/network/dsauto.js";


export async function startSearch(){
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
        searchAlert.style.display="";
        createBrandSelectionData(cats);//Заполняем <Select> производителями авто

    }
