//Проверяем на сервере информацию о пользователе
import { checkUserServer } from "../../const" ;


export async function checkUser(){
     const code=JSON.parse(localStorage.getItem('code'));
     if (!code?.code)return false;//Если данных о пользователе в хранилище нет, к серверу за подтверждением не обращаемся
     const url=checkUserServer + '?code='+ code.code;
     const user= await fetch(url, {
          method: "GET",
          referrerPolicy: "origin-when-cross-origin",
          mode: "cors"
     }).then(response=>response.json())
     .then(data=>{
          if(!data?.status)return false;
          return data.user;
     });

     //Тут должен стоять код проверки даты автоматического залогинивания
     //Если он просрочен - ручное логирование. Потом, требуется править серверную часть

     return user;
}