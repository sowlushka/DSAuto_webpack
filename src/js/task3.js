//С опорой на материал про юникод отсюда https://learn.javascript.ru/regexp-unicode

export function stringSolution3(str){
//Основная функция, в которой осуществляется решение задачи на строки

let upperCase=str.match(/\p{Lu}/gu)?.length ?? 0;
let lowerCase=str.match(/\p{Ll}/gu)?.length ?? 0;
return `Прописных: ${upperCase} <br>Строчных: ${lowerCase}`;
}