<?php
//Модуль серверныйх функций проекта


// Файлы phpmailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

require_once '../wroclaw/assets/php/const.php'; //Константы соединения с базой данных (закрытая для публикации информация)

function generateRandomSymbols($length = 4)
//Генератор случайной строки
{
    $characters = '0123456789ABCDEFGHIJKLMNOPQRTUVWXYZabcdefjhijklmnopqrstuvwxyz$#*&.{}][!`~"/\'\\';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}



function openDB(&$conn, &$err = null)
{
    //Открыть базу данных
    //Переменная $dbh передаётся по ссылке. Через неё осуществляется возврат объекта для работы с DB
    try {
        $conn = new PDO('mysql:host=localhost;dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS_USER);
        return true;
    } catch (PDOException $e) {
        $err = $e;
        return false;
    }
}

function sqlRequest(&$conn, $SQL, &$paramArray, &$result)
{
    //Функция SQL запроса к mysql
    //$result - переменная для возврата результата по ссылке или записи об ошибке в случае неуспеха
    //
    $stmt = $conn->prepare($SQL);
    foreach ($paramArray as $param => $value) {
        $stmt->bindValue($param, $value);
    }
    try {
        $stmt->execute();
        $result = $stmt->fetchAll();
    } catch (PDOException $e) {
        $result = $e;
        return false;
    }

    return true;
}


function SendMail($topic, $body, $email, &$result)
//функция рассылки писем с сайта
{
    $mail = new PHPMailer(True);
    try {
        $mail->SMTPDebug = 0;
        //$mail->MailerDebug = false;
        $mail->isSMTP();
        $mail->CharSet = 'UTF-8'; //кодировка письма
        $mail->Host = SMTP_SERVER;
        $mail->SMTPAuth = true;
        $mail->Username = USERMAIL_OR_LOGIN; //логин
        $mail->Password = MAIL_PASSWORD; // Ваш пароль
        $mail->SMTPSecure = 'tls'; //'tls'; 
        $mail->Port = 465; //587;//у яндекса работает через 465;
        $mail->setFrom(EMAIL_SENDER, 'Administrator'); // Email отправителя
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        // Письмо
        $mail->isHTML(true);
        $mail->addAddress($email); // Email получателя
        $mail->Subject = $topic; // Заголовок письма
        $mail->Body = $body; // Текст письма
        // Отправка
        $mail->send();
        return true;
    } catch (phpmailerException $e) {

        $result = $e; //Pretty error messages from PHPMailer
        return false;
    } catch (Exception $e) {
        $result = $e->getMessage(); //Ошибка почтового отправлени
        return false;
    }
}
