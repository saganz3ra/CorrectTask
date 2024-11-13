const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Desafio = require('./models/Desafio');  // Certifique-se que o caminho para o modelo está correto
const db = admin.firestore();

const colecaoDesafio = db.collection('desafios');
const colecaoSolucao = db.collection('solucao');

// Rota para obter todos os desafios existentes
router.get('/', async (req, res) => {
  try {
    const desafiosRef = colecaoDesafio;
    const desafiosSnapshot = await desafiosRef.get();

    const desafios = await Promise.all(
      desafiosSnapshot.docs.map(async (doc) => {
        const desafioData = doc.data();

        // Buscar as soluções detalhadas com base nos IDs no array solucoes
        const solucoesDetalhadas = [];
        if (desafioData.solucoes && Array.isArray(desafioData.solucoes)) {
          for (const solucaoId of desafioData.solucoes) {
            const solucaoDoc = await db.collection('solucoes').doc(solucaoId).get();
            if (solucaoDoc.exists) {
              solucoesDetalhadas.push({ id: solucaoDoc.id, ...solucaoDoc.data() });
            }
          }
        }

        return {
          id: doc.id,
          ...desafioData,
          dataLimite: desafioData.dataLimite?.toDate ? desafioData.dataLimite.toDate() : null,
          solucoes: solucoesDetalhadas,
        };
      })
    );

    res.status(200).json(desafios);
  } catch (error) {
    console.error('Erro ao obter desafios:', error);
    res.status(500).json({ message: 'Erro ao obter desafios' });
  }
});

// Rota para obter detalhes de um desafio específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const desafioId = req.params.id;
    const desafioDoc = await colecaoDesafio.doc(desafioId).get();

    if (!desafioDoc.exists) {
      return res.status(404).json({ message: 'Desafio não encontrado' });
    }

    const desafioData = desafioDoc.data();
    desafioData.dataLimite = desafioData.dataLimite?.toDate ? desafioData.dataLimite.toDate() : null;

    // Obtem dados do MongoDB
    const desafioMongo = await Desafio.findOne({ firestoreId: desafioId });  // Usando o modelo MongoDB Desafio

    // Envia apenas uma resposta com dados do Firestore e MongoDB combinados
    res.status(200).json({ firestoreData: { id: desafioDoc.id, ...desafioData }, mongoData: desafioMongo });
  } catch (error) {
    console.error('Erro ao obter detalhes do desafio:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do desafio' });
  }
});

// Rota para excluir um desafio específico pelo ID
router.delete('/:id', async (req, res) => {
  try {
    const desafioId = req.params.id;

    // Exclui o desafio
    await colecaoDesafio.doc(desafioId).delete();

    // Excluir também do MongoDB
    await Desafio.deleteOne({ firestoreId: desafioId });

    res.status(200).json({ message: 'Desafio excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir desafio:', error);
    res.status(500).json({ message: 'Erro ao excluir desafio' });
  }
});

// Rota para editar um desafio específico
router.put('/:id', async (req, res) => {
  const desafioId = req.params.id;
  const { desafio, recompensa, dataLimite, descricao } = req.body;

  try {
    if (!desafio || !recompensa || !dataLimite || !descricao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const desafioRef = colecaoDesafio.doc(desafioId);

    await desafioRef.update({
      desafio,
      recompensa,
      dataLimite,
      descricao,
    });

    // Atualiza no MongoDB também
    await Desafio.updateOne(
      { firestoreId: desafioId },
      { $set: { desafio, recompensa, dataLimite, descricao } }
    );

    res.status(200).json({ message: 'Desafio atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar desafio:', error);
    res.status(500).json({ error: 'Erro ao atualizar o desafio' });
  }
});

// Endpoint para adicionar um novo desafio
router.post('/add', async (req, res) => {
  const { desafio, recompensa, dataLimite, descricao, solucoes, comunicacao, criterios, autorId } = req.body;

  // Verificar se o campo 'dataLimite' está presente e é uma data válida
  if (!dataLimite) {
    return res.status(400).json({ error: 'O campo dataLimite é obrigatório.' });
  }

  // Garantir que 'dataLimite' seja convertido para um formato de data válido
  const dataLimiteFormatada = new Date(dataLimite);
  if (isNaN(dataLimiteFormatada)) {
    return res.status(400).json({ error: 'O campo dataLimite precisa ser uma data válida.' });
  }

  // Verificar e corrigir o campo 'solucoes' para não ser undefined
  const solucoesValidadas = solucoes && Array.isArray(solucoes) ? solucoes : [];

  // Criando um novo objeto desafio para Firestore
  const novoDesafioFirestore = {
    desafio,
    recompensa,
    dataLimite: dataLimiteFormatada,  // Usando a data válida
    descricao,
    solucoes: solucoesValidadas,  // Garantindo que 'solucoes' nunca seja undefined
    comunicacao,
    criterios,
    autorId
  };

  try {
    // Salvar no Firestore
    const desafioFirestoreRef = await colecaoDesafio.add(novoDesafioFirestore);
    const firestoreId = desafioFirestoreRef.id;  // Obter o ID gerado no Firestore

    // Criando o objeto para MongoDB
    const novoDesafioMongo = new Desafio({
      desafio,
      recompensa,
      dataLimite: dataLimiteFormatada,
      descricao,
      solucoes: solucoesValidadas,  // Usando 'solucoesValidadas'
      comunicacao,
      criterios,
      autorId,
      firestoreId  // Salvar o ID do Firestore no MongoDB
    });

    // Salvar no MongoDB
    const desafioMongoSalvo = await novoDesafioMongo.save();

    res.status(201).json({ message: 'Desafio adicionado com sucesso', desafioMongo: desafioMongoSalvo });
  } catch (err) {
    console.error('Erro ao adicionar desafio:', err);
    res.status(500).json({ error: 'Erro ao adicionar desafio.' });
  }
});

module.exports = router;
