export function trim(str){


return str.match(/[^\s]+/mg)?.join(' ');
}