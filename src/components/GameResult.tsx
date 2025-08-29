import { useEffect, useState } from "react";
import { useGame } from "../providers/GameProvider";
import { useSocket } from "../providers/SocketProvider";

export default function GameResult(props: any) {
    
    const { choices, handleAskNewGame } = props
    const { gameState, setGameState } = useGame();


    const [ result, setResult ] = useState("");
    const [ isNewGameAsked, setAskNewGame ] = useState(false);
    const playerResult = choices[gameState.playerChoice];
    const opponentResult = choices[gameState.opponentChoice];

    useEffect(() => {
        let gameResult = "";
        
        if (playerResult.beats == gameState.opponentChoice) {
            setGameState((prev) => ({ ...prev, playerWins: gameState.playerWins + 1 }));
            gameResult = `${playerResult.value} beats ${playerResult.value}. You WIN !`
        } else if (opponentResult.beats == gameState.playerChoice) {
            gameResult = `${opponentResult.value} beats ${opponentResult.value}. You lose !`
        } else {
            gameResult = "This is a draw !";
        }

        setResult(gameResult);
    }, []);

    const handleNewGameRequest = () => {
        setAskNewGame(true);
        handleAskNewGame();
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-5 items-center justify-center">
                <div className="w-1/5"><img src={ playerResult.src } alt={ playerResult.value } /></div>
                <span>{ result }</span>
                <div className="w-1/5"><img src={ opponentResult.src } alt={ opponentResult.value } /></div>
            </div>
            <div className="flex items-center justify-center">
                { isNewGameAsked && <div>Waiting for opponent for new game...</div> }
                { !isNewGameAsked && <button className="btn bg-blue-400" onClick={handleNewGameRequest} >New game ?</button> }
            </div>
        </div>
    )
}