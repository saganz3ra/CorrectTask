import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExibirDesafiosfalso.css'; 

function ExibirDeasfios() {
  const [desafios, setDesafios] = useState([]);
  const [detalhesDesafio, setDetalhesDesafio] = useState(null);
  const [novaSolucao, setNovaSolucao] = useState('');
  const [abriCaixaModal, setAbrirCaixaModal] = useState(false); 
  const [editarModal, setEditarModal] = useState(false);
  const [desafioEditado, setDesafioEditado] = useState({
    id: '',
    desafio: '',
    recompensa: '',
    dataLimite: '',
    descricao: '',
  });

  useEffect(() => {
    const mostrarDesafios = async () => {
      try {
        const resposta = await axios.get(`http://localhost:8080/desafios`);
        setDesafios(resposta.data);
      } catch (error) {
        console.error('Aqui não vai dar erro, nuncaaaaaaa', error);
      }
    };

    mostrarDesafios();
  }, []);

  const exibirDetalhesDesafio = async (id) => {
    try {
      const resposta = await axios.get(`http://localhost:8080/desafios/${id}`);
      setDetalhesDesafio(resposta.data);
      setAbrirCaixaModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do desafio:', error);
    }
  };

  const fecharModal = () => {
    setAbrirCaixaModal(false);
    setDetalhesDesafio(null);
  };

  const adicionarSolucao = async (id) => {
    try {
      await axios.post(`http://localhost:8080/desafios/${id}/solucoes`, {
        solucao: novaSolucao,
      });
      alert('Solução adicionada com sucesso');
      setNovaSolucao('');
      exibirDetalhesDesafio(id); 
    } catch (error) {
      console.error('Erro ao adicionar solução:', error);
      alert('Erro ao adicionar solução');
    }
  };

  const funcaoEditarDesafio = (desafio) => {
    setDesafioEditado(desafio);
    setEditarModal(true);
  };

  const fecharEditarDesafio = () => {
    setEditarModal(false);
  };

  const editarDesafio = async () => {
    try {
      await axios.put(`http://localhost:8080/desafios/${desafioEditado.id}`, desafioEditado);
      setDesafios(
        desafios.map((desafio) =>
          desafio.id === desafioEditado.id ? { ...desafio, ...desafioEditado } : desafio
        )
      );
      setEditarModal(false);
      setDesafioEditado({ id: '', desafio: '', recompensa: '', dataLimite: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao editar desafio:', error);
      alert('Erro ao editar desafio');
    }
  };

  const excluirDesafio = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/desafios/${id}`);
      setDesafios(desafios.filter((desafio) => desafio.id !== id))
    } catch (error) {
      console.error('Erro ao excluir desafio:', error);
      alert('Erro ao excluir desafio');
    }
  };

  return (
    <div className="container">
      <strong>Lista de Desafios</strong>
      {desafios.map((desafio) => (
        <div key={desafio.id} className="card">
          <h2>{desafio.desafio}</h2>
          <p>Recompensa: {desafio.recompensa}</p>
          <p>Data Limite: {desafio.dataLimite}</p>
          <p>Descrição: {desafio.descricao}</p>

          {desafio.criterios && (
            <div>
              <strong>Critérios:</strong>
              <ul>
                {desafio.criterios.map((criterio, index) => (
                  <li key={index}>{criterio}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => exibirDetalhesDesafio(desafio.id)} className="button-details">Exibir detalhes</button> <br />
          <button onClick={() => funcaoEditarDesafio(desafio)} className="button-details">Editar</button>
          <button onClick={() => excluirDesafio(desafio.id)} className="button-details">Excluir</button>
        </div>
      ))}

      {abriCaixaModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={fecharModal}>&times;</span>
            <h2>Detalhes do Desafio</h2>
            <p>Descrição: {detalhesDesafio.descricao}</p>
            <p>Recompensa: {detalhesDesafio.recompensa}</p>
            <p>Data Limite: {detalhesDesafio.dataLimite ? new Date(detalhesDesafio.dataLimite).toLocaleDateString('pt-BR') : 'Sem data limite'}</p>
            <p>Autor: {detalhesDesafio.autorId}</p>

            {detalhesDesafio.criterios && (
              <div>
                <strong>Critérios:</strong>
                <ul>
                  {detalhesDesafio.criterios.map((criterio, index) => (
                    <li key={index}>{criterio}</li>
                  ))}
                </ul>
              </div>
            )}

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

      {editarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={fecharEditarDesafio}>&times;</span>
            <h2>Editar Desafio</h2>
            <input
              type="text"
              name="desafio"
              placeholder="Nome do Desafio"
              value={desafioEditado.desafio}
              onChange={(e) => setDesafioEditado({ ...desafioEditado, desafio: e.target.value })}
            />
            <input
              type="text"
              name="recompensa"
              placeholder="Recompensa"
              value={desafioEditado.recompensa}
              onChange={(e) => setDesafioEditado({ ...desafioEditado, recompensa: e.target.value })}
            />
            <input
              type="date"
              name="dataLimite"
              placeholder="Data Limite"
              value={desafioEditado.dataLimite}
              onChange={(e) => setDesafioEditado({ ...desafioEditado, dataLimite: e.target.value })}
            />
            <textarea
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={desafioEditado.descricao}
              onChange={(e) => setDesafioEditado({ ...desafioEditado, descricao: e.target.value })}
            />
            <button onClick={editarDesafio}>Salvar alterações</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExibirDeasfios;
