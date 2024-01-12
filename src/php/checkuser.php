<?php
//Возвращаем данные о пользователе, обратившемуся к серверу

error_reporting(E_ALL);
require './lib.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Content-type: text/html; charset=utf-8');

//Открываем базу данных
$db = null;
$JSON['status'] = false;
if (!openDBforDSAuto($db)) { //Открываем базу данных с обработкой ошибок для приложения DSAuto
    $JSON['err_description'] = "Error database connection";
    die(json_encode($JSON));
}


//Если запрашиваются данные о пользователе по его коду
if (isset($_GET["code"])) {
    //setcookie("code", $_COOKIE["code"], time() + 3600 * 24 * 180, "/");


    $code = isset($_GET['code']) ? $_GET['code'] : 0;


    $SQL = "SELECT * FROM test_user WHERE cookie_id=:code AND checked=1";
    $Params[':code'] = $code;
    $result = null;
    if (!sqlRequest($db, $SQL, $Params, $result)) {
        //Ошибка запроса к базе данных
        $JSON['err_description'] = "При попытке получить инфо о пользователе база данных вернула ошибку";
        $JSON['err_obj'] = $result;
        $db = null;
        die(json_encode($JSON));
    }

    if (count($result)) {
        $JSON['status'] = true;
        $JSON['user']['email'] = $result[0]['email'];
        $JSON['user']['code'] = $result[0]['cookie_id'];
    } else {
        $JSON['err_description'] = "Пользователь не найден";
        $JSON['cookie'] = $_COOKIE["code"];
    }
} else if (isset($_POST['login-email']) && isset($_POST['login-password'])) {

    $SQL = "SELECT * FROM test_user WHERE email=:email AND checked=1";
    $Params[':email'] = $_POST['login-email'];
    $result = null;
    if (!sqlRequest($db, $SQL, $Params, $result)) {
        //Ошибка запроса
        $JSON['err_description'] = "Не удалось выполнить запрос к базе данных поиска пользователя по е-маил";
        $JSON['err_obj'] = $result;
        $db = null;
        die(json_encode($JSON));
    }
    if (!password_verify($_POST['login-password'], $result[0]['pswrd_hash'])) {
        $JSON['err_description'] = "Неверны е-mail или пароль пользователя";
        $db = null;
        die(json_encode($JSON));
    }

    $JSON['status'] = true;
    $JSON['user']['email'] = $result[0]['email'];
    $JSON['user']['code'] = $result[0]['cookie_id'];
}


$db = null;
echo json_encode($JSON);
