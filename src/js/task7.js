export function stringSolution7(str){

   return str.replace(/(\p{L})(\p{L}*)/gui,(match, letter, rest)=> letter.toUpperCase() + rest );
}