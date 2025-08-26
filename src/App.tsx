import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Player from './components/Player';
import ChoicesProvider from './providers/ChoicesProvider';
import Homepage from './components/Homepage';
import Room from './components/Room';
import SocketProvider from './providers/SocketProvider';


function App() {

  return (
    <>
      {/** Router */}
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/room" element={<Navigate to="/" replace />} />
            <Route path="/room/:roomName" element={<Room />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
      
      {/** Header */}

      {/** Page d'accueil */}
      
      {/** Bouton pour créer une room - prompt qui demande vs IA ou vs autre joueur */}
    </>
  )
}

export default App
