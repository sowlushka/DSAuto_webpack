export function stringSolution4(str){
//Основная функция, в которой осуществляется решение задачи на строки


return str.match(/\p{L}+/gu)?.reduce((acc,curr)=>curr.length>acc.length?curr:acc) ?? "Слова не введены";
}