<?php
//Сервер регистрации нового пользователя


error_reporting(E_ALL);
require './lib.php';
require './sql.php'; //Команды SQL к базе данных

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Content-type: text/html; charset=utf-8');

$cookie = generateRandomSymbols(20);
//Ставим куки
$cookie_options = [
    'expires' => time() + 180 * 24 * 3600,
    'path' => '/',
    //'domain' => '*',
    //'samesite' => 'None',
    'secure' => false,
    'httponly' => true
];
setcookie('code', $cookie, $cookie_options);


$db = null; //Глобальная переменная подключения к базе данных
$JSON['status'] = false;
if (!openDBforDSAuto($db)) {
    $JSON['err_description'] = "Error database connection";
    die(json_encode($JSON)); //Открываем базу данных с обработкой ошибок для приложения DSAuto
}




if (isset($_POST['email']) && isset($_POST['password'])) {
    //-------------------БЛОК РЕГИСТРАЦИИ ПОЛЬЗОВАТЕЛЯ------------------------------------------------------------------

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
        die(json_encode($JSON));
    }

    //Регистрируем пользователя в базе данных.

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
    $message = '<div>Для завершения регистрации на сервисе DSAuto перейдите <a href="https://catalyst.h1n.ru/test-temp/reg.php?code=' .
        urlencode($hash) . '">по ссылке:</a> </div>';
    $message .= "<div>Ваш пароль: " . $_POST['password'] . "</div>";
    $result = null; //Переменная ответа
    if (!SendMail($topic, $message, $_POST['email'], $result)) {
        //Не удалось отправить письмо
        $JSON['err_description'] = "Не удалось отправить письмо на е-маил";
        $JSON['err_obj'] = $result;
        $db = null;
        die(json_encode($JSON));
    }


    $JSON['status'] = true;
    $JSON['cookie'] = $cookie;
} else if (isset($_GET['code'])) {
    //-----------------------------БЛОК ПОДТВЕРЖДЕНИЯ Е-МАИЛ----------------------------------------

    //Ищем в базе данных пользователя, ожидающего регистрацию
    $Params[':pass_hash'] = $_GET['code'];
    $result = null;

    if (!sqlRequest($db, SQL_GET_USER_FOR_REGISTR, $Params, $result)) {
        $message = "Не удалось выполнить запрос к базе данных для подтверждения е-маил";
        echo $message;
        die();
    }

    if (!count($result) || $result[0]['checked'] == 1) {
        $message = "Ошибка. Страницы не существует";
        echo $message;
        die();
    }


    if (!sqlRequest($db, SQL_REGISTRATION_FINISH, $Params, $result)) {
        $message = "Не удалось выполнить запрос к базе на завершение регистрации";
        echo $message;
        die();
    }

    //Регистрация выполнена успешно.
    $message = "Регистрация успешно пройдена. Вы можете вернуться на сервис DSAuto";
    echo $message;
    die();
}


$db = null; //Закрываем соединение с базой данных
echo json_encode($JSON);
