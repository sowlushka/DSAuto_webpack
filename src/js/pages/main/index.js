
import { createSearchForm } from "./search-form.js";
import { alertElement } from "./searchAlert.js";



const selectorMain=document.createElement("main");

//Создаём блок для вывода результатов поиска
const catalystList=document.createElement('div');
catalystList.classList.add('catalyst-list');

selectorMain.append(createSearchForm(), catalystList);

//Создаём div для отображения прогресса
const searchAlert=document.createElement('div');
searchAlert.classList.add('search-alert');




//Формируем страницу
export const MainPage=()=>{
    const html=new DocumentFragment;
    html.append(selectorMain, searchAlert, alertElement);
    return html;
};
