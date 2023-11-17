//Вариант решения через польскую запись
import { getPolandExpression, calcPolandExpression } from "./polandNotation";


export function stringSolution8(str){
  let equalParts=str.split('=');
  
  return equalParts.map(part=>{//Строковую часть уравнения преобразуем к результату вычисления

                let operands=part.match(/(^-?\d+\.\d+|^-?\d+)|(\d+\.\d+|\d+)/g);//Получаем массив цифр
                let operators=part.match(/(?<!^)[\+\-*/]/mg) ?? [];//Берём все операторы кроме оператора в первой позиции (знак мину включен в первый операнд)
                return operands.reduce((res, curr,indx)=>{//В этом редьюсе считаем результат выражения
                                                            let operation;
                                                            switch (operators[indx-1]){
                                                                
                                                                case '+':
                                                                    operation=Number(res)+Number(curr);
                                                                    break;
                                                                case '-':
                                                                    operation=Number(res)-Number(curr);
                                                                    break;
                                                                case '/':
                                                                    operation=Number(res)/Number(curr);
                                                                    break;
                                                                case '*':
                                                                    operation=Number(res)*Number(curr);
                                                            }
                                                            return operation;
                                                        });
                }).every((el,indx,arr)=>
                        el==arr[0]);//Проверяем равенство всех частей уравнения

}

export function stringSolution8_2(str){
//Решение выражений через использование польской нотации
  let equalParts=str.split('=');
  
  return equalParts.map(part=>{//Строковую часть уравнения преобразуем к результату вычисления
                let expr=getPolandExpression(part);
                return +calcPolandExpression(expr);
                }).every((el,indx,arr)=>
                        el==arr[0]);//Проверяем равенство всех частей уравнения

}