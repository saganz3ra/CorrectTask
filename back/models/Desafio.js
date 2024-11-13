// models/Desafio.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const desafioSchema = new Schema({
  desafio: { type: String, required: true },
  recompensa: { type: String, required: true },
  dataLimite: { type: Date, required: true },
  descricao: { type: String, required: true },
  solucoes: { type: [String], required: false },
  comunicacao: { type: String, required: false },
  criterios: { type: [String], required: false },
  autorId: { type: String, required: true },
  firestoreId: { type: String, required: false }, // Este campo irá armazenar o ID do Firestore
}, { timestamps: true });

module.exports = mongoose.model('Desafio', desafioSchema);
