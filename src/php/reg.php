<?php
//Сервер регистрации нового пользователя


error_reporting(E_ALL);
require './lib.php';
require './sql.php'; //Команды SQL к базе данных

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Content-type: text/html; charset=utf-8');

$db = null; //Глобальная переменная подключения к базе данных
if (!openDBforDSAuto($db)) die(json_encode($JSON)); //Открываем базу данных с обработкой ошибок для приложения DSAuto


$JSON['status'] = false;
if (isset($_POST['email']) && isset($_POST['password'])) {

    //Проверяем есть ли уже такой пользователь в базе данных
    $result = null; //Переменная ответа
    $Params[':email'] = $_POST['email'];
    if (!sqlRequest($db, SQL_IS_USER_EXISTS, $Params, $result)) {
        //Ошибка запроса к базе данных
        $JSON['err_description'] = "База данных не может обработать запрос на проверку пользователя в базе данных";
        $JSON['err_obj'] = $result;
        $db = null;
        die(json_encode($JSON));
    }

    //Запрос на наличие пользователя в базе обработан корректно
    if (count($result) && $result[0]['checked']) {
        //Такой пользователь уже существует и е-маил подтверждён. Отказываем в регистрации
        $JSON['err_description'] = "Такой пользователь уже зарегистрирован";
        $JSON['err_obj'] = $result;
        die(json_encode($JSON));
    }

    //Регистрируем пользователя в базе данных.
    $cookie = generateRandomSymbols(20);
    $hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $result = null; //Переменная ответа
    $Params[':cookie'] = $cookie;
    $Params[':pswrd_hash'] = $hash;
    if (!sqlRequest($db, SQL_REGISTRATE_USER, $Params, $result)) {
        //Регистрация не удалась
        $JSON['err_description'] = "Ошибка регистрации нового пользователя в базе данных";
        $JSON['err_obj'] = $result;
        $db = null;
        die(json_encode($JSON));
    }

    //Отправляем письмо на е-маил
    $topic = "Завершение регистрации на DSAuto";
    $message = '<div>Для завершения регистрации на сервисе DSAuto перейдите <a href="https://catalyst.h1n.ru/test-temp/regFinish.php?code=' . $cookie . '">по ссылке:</a> </div>';
    $result = null; //Переменная ответа
    if (!SendMail($topic, $message, $_POST['email'], $result)) {
        //Не удалось отправить письмо
        $JSON['err_description'] = "Не удалось отправить письмо на е-маил";
        $JSON['err_obj'] = $result;
        $db = null;
        die(json_encode($JSON));
    }


    $JSON['status'] = true;
}


$db = null; //Закрываем соединение с базой данных
echo json_encode($JSON);






function openDBforDSAuto(&$db)
{
    //Открыть базу данных с обработкой ошибок для приложения Wroclaw
    if (!openDB($db, $err)) {
        //Ошибка открытия базы данных
        $JSON['status'] = false;
        $JSON['err_description'] = "Невозможно установить соединение с базой данных";
        $JSON['err_obj'] = $err;
        $db = null;
        return false;
    }
    return true;
}
