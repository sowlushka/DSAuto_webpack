<?php

//--------------- SQL-запросы ----------------------------------------------------------------------------------------

//Проверка существования пользователя в базе данных
define('SQL_IS_USER_EXISTS', 'SELECT checked FROM test_user WHERE email=:email');


//Регистрация пользователя в таблице пользователей
define(
    'SQL_REGISTRATE_USER',
    'INSERT INTO test_user (email, cookie_id, pswrd_hash) VALUES (:email, :cookie, :pswrd_hash)
     ON DUPLICATE KEY UPDATE cookie_id=:cookie, pswrd_hash=:pswrd_hash'
);



//Получить номер телефона, привязанный к данному устройству и состояние привязки
define('SQL_DEVICE_REGISTRY_PHONE', 'SELECT phone, dev_checked as checked FROM User_Device WHERE cookie=:cookie');

//Получить выборку задач для бота
define('SQL_TASKS', 'SELECT TicketDate FROM wroclaw WHERE phone=:phone AND run_status>0');

//Обновляем время посещения сервера устройством
define('SQL_LAST_VISIT_UPDATE', 'UPDATE User_Device SET last_visit=current_timestamp() WHERE cookie=:cookie');

//Взять в базе код для подтверждения телефона
define('SQL_GET_SMS_CODE', 'SELECT check_sms FROM User_Device WHERE cookie=:cookie');

//Телефон подтверждён
define('SQL_SET_PHONE_VALID', 'UPDATE User_Device SET dev_checked=1 WHERE cookie=:cookie');

//Проверка поставлена ли задача ранее
define('SQL_IS_TASK_EXIST', 'SELECT started FROM wroclaw WHERE phone=:phone AND TicketDate=:date ');

//Ставим задачу на выполнение
define('SQL_SET_TASK', 'INSERT INTO wroclaw (TicketDate, phone, run_status) VALUES (:date, :phone, 1)');

//Получить дату поставленной задачи
define('SQL_GET_DATE_BY_PHONE', 'SELECT TicketDate as `date` FROM wroclaw WHERE phone=:phone');
