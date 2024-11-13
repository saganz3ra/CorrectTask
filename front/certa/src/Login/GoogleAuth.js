import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../Firebase/FirebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Questionario from '../Routes/Questionario';
import EditarUsuario from '../Routes/EditarUsuario';
import './GoogleAuth.css'; // Importe o arquivo CSS

function GoogleAuth() {
  const [usuario, setUsuario] = useState(null);
  const [questionarioCompleto, setQuestionarioCompleto] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (usuario && !questionarioCompleto) {
      setMostrarModal(true);
    }
  }, [usuario, questionarioCompleto]);

  const Login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        const response = await axios.post('http://localhost:8080/contas/login', { idToken });

        const userInfo = response.data;
        console.log('Informações do usuário:', userInfo);

        const userDetails = await axios.get(`http://localhost:8080/contas/user?uid=${userInfo.uid}`);
        setUsuario(userDetails.data);
        setQuestionarioCompleto(userDetails.data.questionarioCompleto);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/contas/logout');
      setUsuario(null);
      setQuestionarioCompleto(false);
      await auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleQuestionarioEnviado = () => {
    setQuestionarioCompleto(true);
    setMostrarModal(false);
    alert('Questionário enviado com sucesso!');
  };

  return (
    <div>
      <h1>Informações do Usuário</h1>
      {usuario ? (
        <div className="usuario-container">
          <div>
            {usuario.photoURL && (
              <img className="usuario-foto" src={usuario.photoURL} alt="Foto do usuário" />
            )}
          </div>
          <div className="usuario-info">
            <h2>{usuario.displayName || 'Usuário'}</h2>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>UID:</strong> {usuario.uid}</p>
            <button onClick={logout}>Logout</button>

            <button onClick={() => setMostrarModal(true)}>Editar Usuário</button>

            {mostrarModal && (
              <EditarUsuario uid={usuario.uid} onClose={() => setMostrarModal(false)} />
            )}
          </div>

          {!questionarioCompleto && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Preencha o Questionário</h2>
                </div>
                <Questionario uid={usuario.uid} onQuestionarioEnviado={handleQuestionarioEnviado} />
              </div>
            </div>
          )}
        </div>

      ) : (
        <button onClick={Login}>Login com Google</button>
      )}
    </div>
  );
}

export default GoogleAuth;
