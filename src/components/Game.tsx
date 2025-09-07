import { useEffect, useState } from "react"
import GameResult from "./GameResult";
import { useGame } from "../providers/GameProvider";
import gameStyles from "../assets/games.json";

export default function Game(props: any) {

    const { socket, roomName, gameStyle } = props;
    const vsComputer = roomName == "vs-computer";
    const { gameState, setGameState } = useGame();
    const [ choices, setChoices ] = useState<any>([]);

    useEffect(() => {
        const style = gameStyles.find(style => style.name == gameStyle);
        if(style) {
            setChoices(style.choices)
        }
    }, [gameStyle]);
    
    useEffect(() => {
        if(!vsComputer) {
            socket.on("opponentChoice", (opponentChoice: number) => {
                setGameState((prev) => ({ ...prev, opponentChoice }));
            });
    
            socket.on("newGame", () => {
                handleNewGame();
            });
        }

        return () => {
            if(!vsComputer) {
                socket.off("opponentChoice");
                socket.off("newGame");
            }
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

    const handleChoice = (choice: number) => {
        setGameState(prev => ({ ...prev, playerChoice: choice }));
    }

    const handleReady = () => {

        const { playerChoice } = gameState;

        if(playerChoice > -1) {
            setGameState(prev => ({ ...prev, ready: true, isValidationEnabled: false }));
            if(!vsComputer) {
                socket.emit('playerChoice', { roomName, choice: playerChoice });
            } else {
                handleComputer()
            }
        }
    }

    const handleAskNewGame = () => {
        if(!vsComputer) {
            socket.emit("newGameAsked", { roomName })
        } else {
            handleNewGame();
        }
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

    const handleComputer = () => {
        const computerChoice = getSecureRandomInt(0, choices.length - 1); // depending of the number of choices
        setGameState((prev) => ({...prev, opponentChoice: computerChoice}));
    }

    // Fonction proposée par ChatGPT 5
    const getSecureRandomInt = (min: number, max: number): number => {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return min + (array[0] % (max - min + 1));
    }

    return (
        <>
        {/* TEST WITH timesFM IA */}
            <div className="flex items-center justify-center gap-5 w-full">
                <h1 className="text-center my-3 font-bold">WINS: {gameState.playerWins}</h1>
                /
                <h1 className="text-center my-3 font-bold">LOSSES: {gameState.playerLosses}</h1>
                /
                <h1 className="text-center my-3 font-bold">DRAWS: {gameState.playerDraws}</h1>
            </div>

            {/** Boutons de choix */}
            { gameState.displayChoices &&
                <>
                    <div className="flex gap-3 items-center justify-center flex-wrap">
                        { choices.map((item: any, key: number) => {
                            return (
                                <button 
                                    key={key}
                                    className={`btn min-w-[100px] max-w-1/4 md:max-w-[200px] ${ gameState.playerChoice == key ? "border-red-500 shadow-md shadow-gray-500" : "" }`}
                                    onClick={() => handleChoice(key)}
                                    disabled={!gameState.isValidationEnabled}
                                >
                                    <img src={`/images/${item.image}`} alt={item.value} />
                                </button>
                            )
                        })}
                    </div>
                    {/** Bouton de validation (Prêt !) */}
                    <div className="flex items-center justify-center gap-5 my-4">
                        { gameState.playerChoice > -1 && <button disabled={!gameState.isValidationEnabled} className="btn btn-blue px-6" onClick={handleReady}>Ready</button> }
                        { gameState.playerChoice < 0 && 
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                            </svg>

                            <div>Select your move</div>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                            </svg>
                        </>}
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