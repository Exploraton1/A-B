const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

// === Ustawienia ===
const telegramToken = 'TWÓJ_TELEGRAM_BOT_TOKEN';
const chatId = 'TWÓJ_CHAT_ID';

// === Funkcja wysyłająca wiadomość przez Telegram ===
async function sendTelegramMessage(signal, price, sl, tp) {
  const message = `📈 Strategia A+B: ${signal.toUpperCase()}\nCena: ${price}\nStop Loss: ${sl}\nTake Profit: ${tp}`;
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
}

// === Endpoint webhooka ===
app.post('/webhook', async (req, res) => {
  const data = req.body;

  if (!data.signal || !data.price) {
    return res.status(400).send('❌ Brak wymaganych danych');
  }

  try {
    console.log(`Otrzymano sygnał: ${data.signal} @ Cena: ${data.price}`);
    console.log(`Stop Loss: ${data.stopLoss}, Take Profit: ${data.takeProfit}`);

    // Wysyłka wiadomości do Telegram
    await sendTelegramMessage(data.signal, data.price, data.stopLoss, data.takeProfit);

    return res.status(200).send('OK');
  } catch (error) {
    console.error("❌ Błąd podczas przetwarzania webhooka:", error);
    return res.status(500).send('Wewnętrzny błąd serwera');
  }
});

// === Uruchomienie serwera ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bot działa na porcie ${PORT}`);
});
