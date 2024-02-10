export class AbstractPage{
    
    constructor(){

    }

    createElement(selectorName, selectorClass){

        const selector=document.createElement(selectorName);
        if (selectorClass ) selector.classList.add(selectorClass);
        return selector;
    }
}