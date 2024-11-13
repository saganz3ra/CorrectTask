import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarUsuario.css'; // Importe um arquivo CSS para estilizar o modal

function EditarUsuario({ uid, onClose }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [CPF, setCPF] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoConta, setTipoConta] = useState('');
  const [experiencias, setExperiencias] = useState([]);
  const [conhecimentos, setConhecimentos] = useState([]);

  useEffect(() => {
    // Carregar dados do usuário ao abrir o modal
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/contas/user?uid=${uid}`);
        const userData = response.data;
        setNomeCompleto(userData.nomeCompleto || '');
        setCPF(userData.CPF || '');
        setDataNascimento(userData.dataNascimento || '');
        setTipoConta(userData.tipoConta || '');
        setExperiencias(userData.experiencias || []);
        setConhecimentos(userData.conhecimentos || []);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/contas/editar-usuario`, {
        uid,
        nomeCompleto,
        CPF,
        dataNascimento,
        tipoConta,
        experiencias,
        conhecimentos,
      });
      alert('Dados do usuário atualizados com sucesso!');
      onClose(); // Fecha o modal após salvar
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error);
      alert('Erro ao atualizar os dados do usuário.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Usuário</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div>
            <label>Nome Completo:</label>
            <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} />
          </div>
          <div>
            <label>CPF:</label>
            <input type="text" value={CPF} onChange={(e) => setCPF(e.target.value)} />
          </div>
          <div>
            <label>Data de Nascimento:</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>
          <div>
            <label>Tipo de Conta:</label>
            <input type="text" value={tipoConta} onChange={(e) => setTipoConta(e.target.value)} />
          </div>
          <div>
            <label>Experiências:</label>
            <input
              type="text"
              value={experiencias.join(', ')}
              onChange={(e) => setExperiencias(e.target.value.split(',').map((exp) => exp.trim()))}
            />
          </div>
          <div>
            <label>Conhecimentos:</label>
            <input
              type="text"
              value={conhecimentos.join(', ')}
              onChange={(e) => setConhecimentos(e.target.value.split(',').map((con) => con.trim()))}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default EditarUsuario;
