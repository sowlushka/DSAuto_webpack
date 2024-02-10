import { AbstractPage } from "../../classes/AbstractPage.js";
import { Alert } from "../../classes/Alert.mjs";
import { createSearchForm } from "./search-form.js";
//import { createHeader } from "../../libs-js/header.js";


export class MainPage extends AbstractPage{
    header;
    selectorMain;
    catalystList;
    searchAlert;
    alert;

    constructor(){
        super();
       //createPage();
    }

    

    createPage(){
        //const header=createHeader();

        this.selectorMain=super.createElement('main');

        //Создаём блок для вывода результатов поиска
        this.catalystList=super.createElement('div','catalyst-list');

        this.selectorMain.append(createSearchForm(), this.catalystList);

        //Создаём div для отображения прогресса
        this.searchAlert=super.createElement('div', 'search-alert');

        this.alertElement=new Alert();

        const html=new DocumentFragment;
        //html.append(header, selectorMain, searchAlert, alertElement);
        html.append(this.selectorMain, this.searchAlert, this.alertElement);
        return html;
    }

}
