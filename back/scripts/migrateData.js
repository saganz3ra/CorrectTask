const db = require('../config/firebase');       // Conexão com Firebase
const mongoose = require('../config/mongoose'); // Conexão com MongoDB
const DesafioMongo = require('../models/Desafio');

async function migrarColecaoDesafios() {
  try {
    const desafiosSnapshot = await db.collection('desafios').get();

    const bulkOps = desafiosSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const desafioData = {
        ...data,
        firestoreId: doc.id,
        dataLimite: data.dataLimite?.toDate ? data.dataLimite.toDate() : null,
      };

      await DesafioMongo.updateOne(
        { firestoreId: doc.id },
        { $set: desafioData },
        { upsert: true }
      );
    });

    await Promise.all(bulkOps);
    console.log('Migração completa da coleção "desafios".');
  } catch (error) {
    console.error('Erro durante a migração da coleção "desafios":', error);
  } finally {
    mongoose.connection.close();
  }
}

migrarColecaoDesafios();
