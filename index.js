const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// === Funkcja testowa – możesz ją rozbudować później ===
app.post('/webhook', (req, res) => {
  const data = req.body;

  console.log("Otrzymano dane:", data);

  if (!data || !data.signal || !data.price) {
    return res.status(400).send('❌ Brak wymaganych danych');
  }

  // Możesz dodać tutaj logikę, np. wysyłkę do Telegrama
  console.log(`Sygnał: ${data.signal}, Cena: ${data.price}`);

  return res.status(200).send('OK');
});

// === Uruchomienie serwera ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook działa na porcie ${PORT}`);
});
