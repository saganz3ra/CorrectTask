import React, { useState } from 'react';
import axios from 'axios';
import Input from '../Components/Input';
import { auth } from '../Firebase/FirebaseConfig';
import './AdicionarDesafio.css';

function AdicionarDesafio() {
  const [desafio, setDesafio] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [descricao, setDescricao] = useState('');
  const [comunicacao, setComunicacao] = useState('');
  const [criterios, setCriterios] = useState('');
  const [listaCriterios, setListaCriterios] = useState([]);

  const adicionarCriterio = () => {
    if (criterios.trim() !== '') {
      setListaCriterios([...listaCriterios, criterios]);
      setCriterios('');
    }
  };

  const handleAdicionarDesafio = async () => {
    try {
      const autorId = auth.currentUser.uid;

      // Verificar se a dataLimite está correta (não nula e válida)
      if (!dataLimite || new Date(dataLimite) == 'Invalid Date') {
        alert('Por favor, insira uma data limite válida.');
        return;
      }

      const novoDesafio = {
        desafio,
        recompensa,
        dataLimite, // A data já vem como string da input do tipo date
        descricao,
        comunicacao,
        criterios: listaCriterios,
        autorId,
      };

      // Atualizado para usar a URL correta do endpoint
      const response = await axios.post('http://localhost:8080/desafios/add', novoDesafio);

      setDesafio('');
      setRecompensa('');
      setDataLimite('');
      setDescricao('');
      setComunicacao('');
      setListaCriterios([]);

      console.log('Desafio adicionado com sucesso:', response.data);
      alert('Desafio adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar desafio:', error);
      alert('Erro ao adicionar desafio');
    }
  };

  return (
    <div className="adicionar-desafio-container">
      <h2>Adicionar um Novo Desafio</h2>
      <strong>Preencha as informações do desafio</strong>
      <Input
        type="text"
        value={desafio}
        onChange={(e) => setDesafio(e.target.value)}
        placeholder="Título do Desafio"
      />
      <Input
        type="text"
        value={recompensa}
        onChange={(e) => setRecompensa(e.target.value)}
        placeholder="Valor da recompensa"
      />
      <Input
        type="date"
        value={dataLimite}
        onChange={(e) => setDataLimite(e.target.value)}
        placeholder="Data limite do desafio"
      />
      <Input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição do Desafio"
      />
      <Input
        type="text"
        value={comunicacao}
        onChange={(e) => setComunicacao(e.target.value)}
        placeholder="Contato"
      />
      <div className="criterios-container">
        <Input
          type="text"
          value={criterios}
          onChange={(e) => setCriterios(e.target.value)}
          placeholder="Critérios para o desafio"
        />
        <button 
          onClick={adicionarCriterio}
          className='botao-criterio'
        >Adicionar Critério</button>
      </div>

      <ul>
        {listaCriterios.map((criterio, index) => (
          <li key={index}>{criterio}</li>
        ))}
      </ul>

      <button onClick={handleAdicionarDesafio}>Salvar Desafio</button>
    </div>
  );
}

export default AdicionarDesafio;
