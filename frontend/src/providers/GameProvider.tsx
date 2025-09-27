import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

// 1. Typage du gameState
interface GameState {
  playerChoice: number;
  opponentChoice: number;
  playerWins: number;
  playerLosses: number;
  playerDraws: number;
  ready: boolean;
  displayResult: boolean;
  displayChoices: boolean;
}

// 2. Typage du contexte
interface GameContextType {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

export const GameContext = createContext<GameContextType | null>(null);

export default function GameProvider(props:any) {
    
    const [ gameState, setGameState ] = useState<GameState>({
        playerChoice: -1,
        opponentChoice: -1,
        playerWins: 0,
        playerLosses: 0,
        playerDraws: 0,
        ready: false,
        displayResult: false,
        displayChoices: true
    });
    

    return (
        <GameContext.Provider value={{ gameState, setGameState }}>
            {props.children}
        </GameContext.Provider>
    )
}

// ✅ Hook pour simplifier l'utilisation
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};