import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Room from './components/Room';
import SocketProvider from './providers/SocketProvider';
import Header from './components/Header';
import RoomCreation from './components/RoomCreation';


function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/room" element={<Navigate to="/" replace />} />
            <Route path="/room/:roomName" element={<Room />} />
            <Route path="/create-room" element={<RoomCreation />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </>
  )
}

export default App
