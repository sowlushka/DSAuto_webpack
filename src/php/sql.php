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

//Поиск пользователя, ожидающего регистрацию
define('SQL_GET_USER_FOR_REGISTR', 'SELECT checked FROM test_user WHERE cookie_id=:code');


//Завершаем регистрацию
define('SQL_REGISTRATION_FINISH', 'UPDATE test_user SET checked=1 WHERE cookie_id=:code');
