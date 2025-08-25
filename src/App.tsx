import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Player from './components/Player';
import ChoicesProvider from './providers/ChoicesProvider';
import Homepage from './components/Homepage';
import Room from './components/Room';
import SocketProvider from './providers/SocketProvider';


function App() {

  return (
    <SocketProvider>
      {/* <ChoicesProvider>
        <Player />
      </ChoicesProvider> */}
      
      {/** Router */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create-room" element={<Room />} />
        </Routes>
      </BrowserRouter>
      
      {/** Header */}

      {/** Page d'accueil */}
      <Outlet />
      
      {/** Bouton pour créer une room - prompt qui demande vs IA ou vs autre joueur */}
    </SocketProvider>
  )
}

export default App
