//Проверяем на сервере информацию о пользователе
import { checkUserServer } from "../../const" ;


export const user=checkUser();

export async function checkUser(){
   const user= await fetch(checkUserServer, {
        method: "GET",
        referrerPolicy: "origin-when-cross-origin",
        mode: "cors"
   }).then(response=>response.json())
   .then(data=>{
        if(!data?.status)return false;
        return data.user;
   });

   return user;
}