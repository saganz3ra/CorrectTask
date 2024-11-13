const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const serviceAccount = require('./config/correcttask-firebase-adminsdk-99r4a-fd4259c8cb.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const porta = 8080;

// Configuração do Firebase e MongoDB
mongoose.connect('mongodb://localhost:27017/desafios', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use(cors());
app.use(express.json());

const RotaDesario = require('./Desafios');
const RotaContas = require('./Contas');

// Definindo rotas
app.use('/desafios', RotaDesario);
app.use('/contas', RotaContas);

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
