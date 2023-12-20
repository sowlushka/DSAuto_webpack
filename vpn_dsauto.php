<?php
//Серверный модуль для обхода ограничений кросс-доменных запросов
//Хостим по адресу https://s250133.h1n.ru/vpn.php

$html = "incorrect request";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type'); //X-Requested-With
header('Content-type: text/plain; charset=utf-8');

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);


if (isset($data)) {
    //Получен запрос на чтение HTML по адресу url
    $url = $data['url'];
    $ch = curl_init();                              // Инициализируем сеанс CURL
    curl_setopt($ch, CURLOPT_URL, $url);   // Заходим на сайт
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // Переадресацию не выполняем
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Делаем так, чтобы страница не выдавалась сразу в поток, а можно было ее записать в переменную
    $html = curl_exec($ch);                         // Имитируем заход на сайт
    curl_close($ch);        // Закрываем сеанс работы CURL
}

$JSON = [];
preg_match('/(?<=pokaz_cene_mobile\()\d+/', $html, $id);
$JSON['id'] = $id[0];
preg_match('/(?<=weight).*?(\d+\.?\d*)(?=\skg<)/si', $html, $mass);
$JSON['mass'] = $mass[1];


echo json_encode($JSON);
