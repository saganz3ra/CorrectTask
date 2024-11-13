const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dadosFire', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Conectado ao MongoDB');
});

module.exports = mongoose;
