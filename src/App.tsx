import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Room from './components/Room';
import SocketProvider from './providers/SocketProvider';
import Header from './components/Header';


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
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </>
  )
}

export default App
