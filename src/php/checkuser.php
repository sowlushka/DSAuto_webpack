<?php
//Возвращаем данные о пользователе, обратившемуся к серверу

error_reporting(E_ALL);
require './lib.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Content-type: text/html; charset=utf-8');

//Если куки стоят, продливаем их срок действия на 180 дней
if (isset($_COOKIE["code"])) {
    setcookie("code", $_COOKIE["code"], time() + 3600 * 24 * 180, "/");
}


//Открываем базу данных
$db = null;
$JSON['status'] = false;
if (!openDBforDSAuto($db)) { //Открываем базу данных с обработкой ошибок для приложения DSAuto
    $JSON['err_description'] = "Error database connection";
    die(json_encode($JSON));
}

$SQL = "SELECT * FROM test_user WHERE cookie_id=:code";
$Params[':code'] = $_COOKIE['code'];
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
    //$JSON['SQL'] = $SQL;
    $JSON['cookie'] = $_COOKIE["code"];
}


$db = null;
echo json_encode($JSON);
