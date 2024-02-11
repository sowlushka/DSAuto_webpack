//отрисовка html-блока main


//Изображения проекта
import ptSvg from "../../../static/icons/pt.svg";
import pdSvg from "../../../static/icons/pd.svg";
import rhSvg from "../../../static/icons/rh.svg";
import { sortTotal} from '../../libs-js/filters.js';
import { AbstractPage } from "../../classes/AbstractPage.js";


export class SearchForm extends AbstractPage{
    form;
    startSearchCallback;// Метод поиска данных

    constructor(){
        super();
        //this.create();
    }

    create(){
        const formHTML=`
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
        this.form=super.createElement('form','form__cat-search');
        this.form.insertAdjacentHTML('afterbegin', formHTML);
        const vehicleBrands=this.form.querySelector('.vehicle-brands');
        vehicleBrands.addEventListener('change', sortTotal);

        //события выбора фильтров Pt, Pd, Rh
        const metallsCheckboxes=this.form.querySelectorAll('input[type="checkbox"][id^="metalls__"]');

        metallsCheckboxes.forEach(input=>{
        //Вешаем фильтры выбора металлов
            input.addEventListener('change',sortTotal);
        });

        this.form.querySelector('#form__cat-search__button').addEventListener('click', this.startSearchCallback)
        
    }

}


  