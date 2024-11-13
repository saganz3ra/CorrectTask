import React, { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import Rotas from './Routes/Rotas'; // Certifique-se de que o caminho esteja correto
import './App.css'; // Arquivo de estilos

function App() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <BrowserRouter>
      {/* Botão de alternância fora da barra lateral */}
      <button className={`toggle-btn ${menuAberto ? 'open' : ''}`} onClick={toggleMenu}>
        ☰
      </button>
      <div className={`sidebar ${menuAberto ? 'open' : ''}`}>
        <nav>
          <Link to='/home'>Home</Link>
          <Link to='/googleauth'>Google Auth</Link>
          <Link to='/adicionar'>Adicionar Desafio</Link>
          <Link to='/exibirdesafio'>Exibir Desafios Falso</Link>
        </nav>
      </div>
      <div className={`content ${menuAberto ? 'content-open' : ''}`}>
        <Rotas />
      </div>
    </BrowserRouter>
  );
}

export default App;
