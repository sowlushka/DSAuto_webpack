export function stringSolution5(str){
//Задача на слова-перевёртыши


return str.match(new RegExp(
                            str.split("").reverse().join(""),
                            "i"))?true:false;
}