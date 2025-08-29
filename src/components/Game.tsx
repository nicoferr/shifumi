import { useEffect } from "react"
import GameResult from "./GameResult";
import { useGame } from "../providers/GameProvider";

export default function Game(props: any) {

    const { socket, roomName } = props;
    const { gameState, setGameState } = useGame();
    
    useEffect(() => {
        socket.on("opponentChoice", (opponentChoice: number) => {
            setGameState((prev) => ({ ...prev, opponentChoice }));
        });

        socket.on("newGame", () => {
            handleNewGame();
        });

        return () => {
            socket.off("opponentChoice");
            socket.off("newGame");
        }
    }, [])

    useEffect(() => {
        const { ready, playerChoice, opponentChoice } = gameState;
        if(ready) {
            if(playerChoice > -1 && opponentChoice > -1) {
                setGameState((prev) => ({ ...prev, displayResult: true, displayChoices: false, ready: false }))
            }
        }
    }, [gameState])

    const choices = [
        { beats: 2, value: "Rock", src: "/images/skins/hands/rock.png" }, 
        { beats: 0, value: "Paper", src: "/images/skins/hands/paper.png" }, 
        { beats: 1, value: "Scissors", src: "/images/skins/hands/scissors.png" }, 
    ]

    const handleChoice = (choice: number) => {
        setGameState(prev => ({ ...prev, playerChoice: choice }));
    }

    const handleReady = () => {

        const { playerChoice } = gameState;

        if(playerChoice > -1) {
            setGameState(prev => ({ ...prev, ready: true, isValidationEnabled: false }));
            socket.emit('playerChoice', { roomName, choice: playerChoice });
        }
    }

    const handleAskNewGame = () => {
        socket.emit("newGameAsked", { roomName })
    }

    const handleNewGame = () => {
        setGameState((prev) => ({
            ...prev,
            displayResult: false,
            playerChoice: -1,
            opponentChoice: -1,
            displayChoices: true,
            isValidationEnabled: true

        }))
    }

    return (
        <>
        {/* TEST WITH timesFM IA */}
            
            <h1 className="text-center my-3 font-bold">WINS: {gameState.playerWins}</h1>

            {/** Boutons de choix */}
            { gameState.displayChoices &&
                <>
                    <div className="flex gap-3 items-center justify-center">
                        { choices.map((item: any, key: number) => {
                            return (
                                <button 
                                    key={key}
                                    className={`btn w-1/10 ${ gameState.playerChoice == key ? "border-red-500 shadow-md shadow-gray-500" : "" }`}
                                    onClick={() => handleChoice(key)}
                                    disabled={!gameState.isValidationEnabled}
                                >
                                    <img src={item.src} alt={item.value} />
                                </button>
                            )
                        })}
                    </div>
                    {/** Bouton de validation (Prêt !) */}
                    <div className="flex items-center justify-center my-4">
                        <button disabled={!gameState.isValidationEnabled} className="btn bg-green-500 text-white" onClick={handleReady}>Ready</button>
                    </div>
                </>
            }
            { gameState.displayResult && 
                <GameResult
                    choices={choices}
                    handleAskNewGame={handleAskNewGame}
                />
            }
        </>
    )
}