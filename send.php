<?php
// Отключаем ошибки в браузере, чтобы не сломать JSON-ответ
ini_set('display_errors', 0);
header('Content-Type: application/json');

// Получаем JSON от JavaScript
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && $data) {
    $name = isset($data['name']) ? trim($data['name']) : '';
    $phone = isset($data['tel']) ? trim($data['tel']) : '';
    $company = isset($data['company']) ? trim($data['company']) : '';

    // Спам-защита (скрытое поле company)
    if (!empty($company)) {
        echo json_encode(['status' => 'error', 'message' => 'Spam detected']);
        exit;
    }

    if (empty($name) || empty($phone)) {
        echo json_encode(['status' => 'error', 'message' => 'Empty fields']);
        exit;
    }

    // Текст сообщения
    $message = "Новая заявка с сайта Ривьера Холл:\n\nИмя: $name\nТелефон: $phone";

    // ==========================================
    // 1. Отправка на почту
    // ==========================================
    $to = "RiveraHoll@rg-gorsovet.ru"; // Почта, которую вы указали
    $subject = "Заявка с сайта Ривьера Холл";
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'riviera-hall.ru';
    $headers = "From: noreply@" . $host . "\r\n";
    $headers .= "Reply-To: noreply@" . $host . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Функция mail() сработает, если сайт размещен на обычном хостинге (Beget, Reg.ru и т.д.)
    mail($to, $subject, $message, $headers);


    // ==========================================
    // 2. Отправка в Telegram
    // ==========================================
    // ВСТАВЬТЕ СЮДА ТОКЕН ВАШЕГО БОТА (например: 123456789:ABCDefgh...)
    $tg_token = "ВАШ_ТОКЕН_БОТА"; 
    // ВСТАВЬТЕ СЮДА ID ВАШЕГО ЧАТА (Макса) (например: 12345678)
    $tg_chat_id = "ВАШ_CHAT_ID";

    if ($tg_token != "ВАШ_ТОКЕН_БОТА" && $tg_chat_id != "ВАШ_CHAT_ID") {
        $tg_url = "https://api.telegram.org/bot" . $tg_token . "/sendMessage?chat_id=" . $tg_chat_id . "&text=" . urlencode($message);
        // Подавление ошибок при отправке запроса
        @file_get_contents($tg_url);
    }

    // Отправляем успешный ответ форме
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
