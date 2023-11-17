export function stringSolution2(str){
//Основная функция, в которой осуществляется решение задачи на строки

    return "["+str.match(/\d+\.\d+|\d+/g)?.join(", ")+"]";
}