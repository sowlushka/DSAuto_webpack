export async function getEcotradeCatSerials(searchString){
    await fetch(constants.urlEcotradeSearchServer + searchString,{
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "accept": "*/*"
    },
    referrerPolicy: "origin-when-cross-origin",
    mode: "cors",
    cache: "default",
    redirect: "follow"
  })
      .then(response=>
          response.text())
      .then((text)=>{
        //let ecotradeData=JSON.parse(text.match(/let products = (\{.*?\});/su)[1]);
        //Получаем массив блоков с данными о катализаторах Ecotrade
        let ecotrCatsData=Array.from(text.matchAll(/class="shadow.+?(<a.+?)<strong/sug));
        ecotrCatsData.forEach(dataText=>{
          
        });
        debugger;
      });
}