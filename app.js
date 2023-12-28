const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors());

// Прокси-маршрут
app.use('/api', async (req, res) => {
    const url = `https://todo.doczilla.pro/api${req.url}`;
    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Ошибка при выполнении запроса к API' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
