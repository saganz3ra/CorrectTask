import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExibirDesafiosfalso.css'; 

function ExibirDesafios() {
  const [desafios, setDesafios] = useState([]);
  const [detalhesDesafio, setDetalhesDesafio] = useState(null);
  const [novaSolucao, setNovaSolucao] = useState('');
  const [modalAberto, setModalAberto] = useState(false); 

  const [editDesafio, setEditDesafio] = useState({
    id: '',
    desafio: '',
    recompensa: '',
    dataLimite: '',
    descricao: '',
  });

  useEffect(() => {
    const mostraDesafios = async () => {
      try {
        const resposta = await axios.get(`http://localhost:8080/desafios`);
        setDesafios(resposta.data);
      } catch (error) {
        console.error('Me mata de uma vezzzzz, mostrarDesafios:', error);
      }
    };

    mostraDesafios();
  }, []);

  const exibirDetalhes = async (id) => {
    try {
      const resposta = await axios.get(`http://localhost:8080/desafios/${id}`);
      setDetalhesDesafio(resposta.data);
      setModalAberto(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do desafio:', error);
    }
  };

  const adicionarSolucao = async (id) => {
    try {
      await axios.post(`http://localhost:8080/desafios/${id}/solucoes`, {
        solucao: novaSolucao,
      });
      alert('Solução adicionada com sucesso');
      setNovaSolucao('');
      exibirDetalhes(id); // Atualiza os detalhes após adicionar
    } catch (error) {
      console.error('Erro ao adicionar solução:', error);
      alert('Erro ao adicionar solução');
    }
  };

  const excrudDesafio = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/desafios/${id}`);
      setDesafios(desafios.filter((desafio) => desafio.id !== id));
      alert('Desafio excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir desafio:', error);
      alert('Erro ao excluir desafio');
    }
  };

  const handleEditarDesafio = async () => {
    try {
      await axios.put(`http://localhost:8080/desafios/${editDesafio.id}`, editDesafio);
      setDesafios(
        desafios.map((desafio) =>
          desafio.id === editDesafio.id ? { ...desafio, ...editDesafio } : desafio
        )
      );
      alert('Desafio atualizado com sucesso');
      setDetalhesDesafio(null);
      setEditDesafio({ id: '', desafio: '', recompensa: '', dataLimite: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao editar desafio:', error);
      alert('Erro ao editar desafio');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDesafio((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setModalAberto(false); // Fecha o modal
  };

  return (
    <div className="container">
      <strong>Lista de Desafios</strong>
      {desafios.map((desafio) => (
        <div key={desafio.id} className="card">
          <h2>Nome: {desafio.desafio}</h2>
          <p>Recompensa: {desafio.recompensa}</p>
          <p>Data Limite: {desafio.dataLimite}</p>
          <p>Descrição: {desafio.descricao}</p>
          <button onClick={() => exibirDetalhes(desafio.id)} className="button-details">Exibir detalhes</button>
          <button onClick={() => excrudDesafio(desafio.id)} className="button-delete">Excluir</button>
          <button onClick={() => setEditDesafio({ ...desafio })} className="button-edit">Editar</button>
        </div>
      ))}

      {modalAberto && detalhesDesafio && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>X</button>
            <h2>Detalhes do Desafio</h2>
            <p><strong>Descrição:</strong> {detalhesDesafio.descricao}</p>
            <p><strong>Recompensa:</strong> {detalhesDesafio.recompensa}</p>
            <p><strong>Data Limite:</strong> {detalhesDesafio.dataLimite ? new Date(detalhesDesafio.dataLimite).toLocaleDateString('pt-BR') : 'Sem data limite'}</p>
            <p><strong>Autor:</strong> {detalhesDesafio.autorId}</p>
            <ul>
              <strong>Soluções:</strong>
              {detalhesDesafio.solucoes?.map((solucao, index) => (
                <li key={index}>{solucao}</li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Adicionar solução"
              value={novaSolucao}
              onChange={(e) => setNovaSolucao(e.target.value)}
            />
            <button onClick={() => adicionarSolucao(detalhesDesafio.id)}>Salvar</button>
          </div>
        </div>
      )}

      {editDesafio.id && (
        <div className="edit-section">
          <h2>Editar Desafio</h2>
          <input
            type="text"
            name="desafio"
            placeholder="Nome do Desafio"
            value={editDesafio.desafio}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="recompensa"
            placeholder="Recompensa"
            value={editDesafio.recompensa}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="dataLimite"
            placeholder="Data Limite"
            value={editDesafio.dataLimite}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={editDesafio.descricao}
            onChange={handleInputChange}
          />
          <button onClick={handleEditarDesafio}>Salvar alterações</button>
        </div>
      )}
    </div>
  );
}

export default ExibirDesafios;
