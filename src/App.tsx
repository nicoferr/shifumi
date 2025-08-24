import './App.css'
import Player from './components/Player'
import ChoicesProvider from './providers/ChoicesProvider'

function App() {


  return (
    <>
      <ChoicesProvider>
        <Player />
      </ChoicesProvider>
      {/** Router */}
      {/** Header */}
      {/** Page d'accueil */}
      {/** Bouton pour créer une room - prompt qui demande vs IA ou vs autre joueur */}
    </>
  )
}

export default App
