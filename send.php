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
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'riverahall.ru';
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
    // ВСТАВЬТЕ СЮДА ID ВАШЕГО ЧАТА (например: 12345678)
    $tg_chat_id = "ВАШ_CHAT_ID";

    if (!empty($tg_token) && $tg_token !== "ВАШ_ТОКЕН_БОТА" && !empty($tg_chat_id) && $tg_chat_id !== "ВАШ_CHAT_ID") {
        $tg_url = "https://api.telegram.org/bot" . $tg_token . "/sendMessage?chat_id=" . $tg_chat_id . "&text=" . urlencode($message);
        @file_get_contents($tg_url);
    }


    // ==========================================
    // 3. Отправка в мессенджер МАКС (MAX)
    // ==========================================
    // Вставьте сюда Webhook URL или адрес бота из приложения МАКС
    $max_webhook_url = "ВАШ_WEBHOOK_ИЛИ_URL_ДЛЯ_МАКС";

    if (!empty($max_webhook_url) && $max_webhook_url !== "ВАШ_WEBHOOK_ИЛИ_URL_ДЛЯ_МАКС") {
        $max_payload = json_encode([
            'text' => $message,
            'name' => $name,
            'phone' => $phone,
            'source' => 'riverahall.ru',
            'created_at' => date('Y-m-d H:i:s')
        ], JSON_UNESCAPED_UNICODE);

        if (function_exists('curl_init')) {
            $ch = curl_init($max_webhook_url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, $max_payload);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($max_payload)
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            @curl_exec($ch);
            curl_close($ch);
        } else {
            $opts = [
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/json\r\n",
                    'content' => $max_payload,
                    'timeout' => 5
                ]
            ];
            $context = stream_context_create($opts);
            @file_get_contents($max_webhook_url, false, $context);
        }
    }

    // Отправляем успешный ответ форме
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
