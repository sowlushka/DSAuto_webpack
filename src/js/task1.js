export function stringSolution1(str){
    
    return str.replace(/\D/g,"").replace(/^8|^7/,'+7');
}