import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import GoogleAuth from '../Login/GoogleAuth';
import DetalhesDesafio from '../DataManipulation/DesafioDetalhados';
import AdicionarDesafio from '../DataManipulation/AdicionarDesafio';
import ExibirDeasfios from '../DataManipulation/ExibirDesafiosFalso';

const Rotas = () => {
   return (
       <Routes>
           <Route path="/home" element={<Home />} />
           <Route path="/googleauth" element={<GoogleAuth />} />
           <Route path="/adicionar" element={<AdicionarDesafio />} />
           <Route path="/desafios/:id" element={<DetalhesDesafio />} />
           <Route path="/exibirdesafio" element={<ExibirDeasfios />} />
       </Routes>
   );
}

export default Rotas;
