import { tasks } from "./config";

tasks.forEach(createTaskHTML);




export function createTaskHTML(objTask){
//В HTML добавляется блок с заданием номер taskNum и текстом задания taskText
//Приглашающий текст для пользователя ввести данные передаётся в inputText
  objTask.inputText??="Введите строку:";
  objTask.inputType??="text";

  const htmlID="task"+objTask.id;
  const formID="form"+objTask.id
  const HTML=`
  <div class="task">
      <h2>Задание ${objTask.id}</h2>
      <div class="task-description">
        ${objTask.task}
      </div>
      <form class="solution" id="${formID}">
        <div class="solution-inputs-container">
          <label for="${htmlID}">${objTask.inputText}</label>
          <input id="${htmlID}" type="${objTask.inputType}">
          <button type="button">ОК</button>
          <div class="solution-result"></div>
        </div>
      </form>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend",HTML);

  const form=document.getElementById(formID);
  const button=document.querySelector(`#${htmlID} + button`);
  const input=document.getElementById(htmlID);
  
  button.onclick=(e)=>{
    let str=input.value;
    form.querySelector('.solution-result').innerHTML=objTask.solution(str);
  }
  
  form.onsubmit=(e)=>{
    e.preventDefault();
    button.onclick();
  }
  
  input.onfocus=(e)=>{
    e.target.value="";
   form.querySelector(`.solution-result`).innerHTML="";
  }


}