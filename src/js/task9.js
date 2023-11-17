import { getPolandExpression, calcPolandExpression } from "./polandNotation";

export function stringSolution9(str){
 
    let expr=getPolandExpression(str);
    return calcPolandExpression(expr);
}