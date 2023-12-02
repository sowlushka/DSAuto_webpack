<?php
//Серверный модуль для обхода ограничений кросс-доменных запросов
//Хостим по адресу https://s250133.h1n.ru/vpn.php

$html = "incorrect request";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Content-type: text/html; charset=utf-8');

if (isset($_POST['url']) || isset($_GET['url'])) {
    //Получен запрос на чтение HTML по адресу url
    $url = isset($_GET['url']) ? $_GET['url'] : $_POST['url'];
    $ch = curl_init();                              // Инициализируем сеанс CURL
    curl_setopt($ch, CURLOPT_URL, $url);   // Заходим на сайт
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); // Переадресацию не выполняем
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Делаем так, чтобы страница не выдавалась сразу в поток, а можно было ее записать в переменную
    $html = curl_exec($ch);                         // Имитируем заход на сайт
    curl_close($ch);        // Закрываем сеанс работы CURL
}

echo $html;
