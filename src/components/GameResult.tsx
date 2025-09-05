import { useEffect, useState } from "react";
import { useGame } from "../providers/GameProvider";

export default function GameResult(props: any) {
    
    const { choices, handleAskNewGame } = props
    const { gameState, setGameState } = useGame();

    const [ result, setResult ] = useState("");
    const [ isNewGameAsked, setAskNewGame ] = useState(false);
    const playerResult = choices[gameState.playerChoice];
    const opponentResult = choices[gameState.opponentChoice];

    useEffect(() => {
        let gameResult = "";
        
        // Check if we get the beat object from games.json for the player
        const playerBeats = playerResult.beats.find((obj: { id: number, verb: string }) => {
            return obj.id == gameState.opponentChoice
        });
        // Check if we get the beat object from games.json for the opponent
        const opponentBeats = opponentResult.beats.find((obj: { id: number, verb: string }) => {
            return obj.id == gameState.playerChoice
        });

        if (playerBeats) {
            setGameState((prev) => ({ ...prev, playerWins: gameState.playerWins + 1 }));
            gameResult = `${playerResult.value} ${playerBeats.verb} ${opponentResult.value}. You WIN !`
        } else if(opponentBeats) {
            setGameState((prev) => ({ ...prev, playerLosses: gameState.playerLosses + 1 }));
            gameResult = `${opponentResult.value} ${opponentBeats.verb} ${playerResult.value}. You lose !`
        } else {
            setGameState((prev) => ({ ...prev, playerDraws: gameState.playerDraws + 1 }));
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
                <div className="w-1/5"><img src={`/images/${playerResult.image}`} alt={ playerResult.value } /></div>
                <span>{ result }</span>
                <div className="w-1/5"><img src={`/images/${opponentResult.image}` } alt={ opponentResult.value } /></div>
            </div>
            <div className="flex items-center justify-center">
                { isNewGameAsked && <div>Waiting for opponent for new game...</div> }
                { !isNewGameAsked && <button className="btn btn-red" onClick={handleNewGameRequest} >New game ?</button> }
            </div>
        </div>
    )
}