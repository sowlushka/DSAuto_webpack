//Разбор математических выражений согласно польской нотации
// http://www.interface.ru/home.asp?artId=1492

const priority={
    "(":1,
    ")":1,
    "+":2,
    "-":2,
    "*":3,
    "/":3,
    "^":4}


export function getPolandExpression(strExpr){
//Возвращает математическую запись в польской нотации в виде объекта
//str - строковое выражение в инфиксной записи

    let str=strExpr[0]=="-"?"0"+strExpr:strExpr;//Унарный минус в начале строки превращаем в бинарный

    let stream=str.match(/([^\s+\-*\/\^)(]+)|([+\-*\/\^)(])/g);//Получаем поток аргументов и операторов

    let stack=[];
    let result=[];
    for(let i=0;i<stream.length;++i){
        if(priority[stream[i]]){
        //Очередной элемент выражения является оператором
            if(!stack.length || stream[i]=="(" || priority[stack[stack.length-1]]<=priority[stream[i]]){
            //Стек пуст или открывающая скобка или приоритет операций в стеке ниже текущего
                stack.push(stream[i]);
            }
            else{
            //В стеке находятся операции с бОльшим или равным приоритетом. Извлекаем их в выходную строку
                for(let j=stack.length;j>=0;--j){
                    let operator=stack[stack.length-1];
                    if(operator=="(" && stream[i]==")"){
                        stack.pop();//Удаляем из стека открывающуюся скобку
                        break;
                    } else if(priority[operator]>=priority[stream[i]]){
                        result.push(operator);
                        stack.pop();
                    }
                }

                if(stream[i]!=")")stack.push(stream[i]);//Операцию заносим в стек
            }
        }else{
        //Элемент выражения является аргументом
            result.push(stream[i]);
        }
    }

    for(;stack.length>0;){
    //Освобождаем стек
        result.push(stack.pop());
    }

    return result;
}

export function calcPolandExpression(expr){
//Вычисление выражений, записанных в польской нотации
    let stack=[];
    expr.forEach(el=>{
        if(priority[el]){
        //Получен оператор
            if(isNaN(stack[stack.length-1]) || isNaN(stack[stack.length-2])){
            //Численное решение невозможно
                stack.push(el);
            }else{
                let arg2=stack.pop();
                switch(el){
                    case "+":
                        stack[stack.length-1]+=arg2;
                        break;
                    case "-":
                        stack[stack.length-1]-=arg2;
                        break;
                    case "*":
                        stack[stack.length-1]*=arg2;
                        break;
                    case "/":
                        stack[stack.length-1]/=arg2;
                        break;
                    case "^":
                        stack[stack.length-1]**=arg2;
                        break;
                }
            }       
        }else{
        //получен аргумент
            if(isNaN(el)){
                stack.push(el);
            }else{
                stack.push(+el);
            }
            
        }
    });
    return stack.join(" ");
}