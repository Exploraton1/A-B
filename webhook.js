const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

// === Ustawienia ===
const telegramToken = '8172077960:AAGbuWwa_GaxMwFVnyoYR5zwKVAnDOta6K4';
const chatId = '-1002593483655';

// === Funkcja wysyłająca wiadomość do Telegram ===
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

    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error("❌ Błąd podczas przetwarzania webhooka:", error);
    return res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
});

// === Uruchomienie serwera ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook działa na porcie ${PORT}`);
});
