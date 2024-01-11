
import { createSearchForm } from "./search-form.js";
import { alertElement } from "./searchAlert.js";
import { createHeader } from "../../libs-js/header.js";


export const MainPage=createMainPage;


export function createMainPage(){
    const header=createHeader();

    const selectorMain=document.createElement("main");

    //Создаём блок для вывода результатов поиска
    const catalystList=document.createElement('div');
    catalystList.classList.add('catalyst-list');

    selectorMain.append(createSearchForm(), catalystList);

    //Создаём div для отображения прогресса
    const searchAlert=document.createElement('div');
    searchAlert.classList.add('search-alert');

    const html=new DocumentFragment;
    html.append(header, selectorMain, searchAlert, alertElement);
    return html;
}