import { useEffect, useState } from "react"

export default function Game(props: any) {

    const { socket, roomName } = props;
    const [ choice, setChoice ] = useState(-1);
    const [ opponentChoice, setOpponentChoice] = useState(-1);
    const [ ready, setReady ] = useState(false);
    const [ wins, setWins ] = useState(0);
    const [ winner, setWinner ] = useState("");
    
    useEffect(() => {
        socket.on("opponentChoice", (opponentChoice: number) => {
            setOpponentChoice(opponentChoice);
        });

        return () => {
            socket.off("opponentChoice");
        }
    }, [])

    useEffect(() => {
        if(ready) {
            if(choice > -1 && opponentChoice > -1) {
                setWinner(getWinner(choice, opponentChoice));
            }
        }
    }, [ready, choice, opponentChoice])

    const choices = [
        { beats: 2, value: "rock", label: "👊" }, 
        { beats: 0, value: "paper", label: "✋" }, 
        { beats: 1, value: "scissors", label: "✌" }, 
    ]

    const handleReady = () => {
        setReady(true);
        socket.emit('playerChoice', { roomName, choice });
    }

    const getWinner = (playerChoice: number, opponentChoice: number) => {
        
        const player = choices[playerChoice];
        const opponent = choices[opponentChoice];
        
        setChoice(-1);
        setOpponentChoice(-1);
        setReady(false);

        if (player.beats == opponentChoice) {
            setWins(prev => prev + 1);
            return `${player.value} beats ${opponent.value}. You WIN !`
        }
        
        if (opponent.beats == playerChoice) {
            return `${opponent.value} beats ${player.value}. You lose !`
        }


        return "This is a draw !"
    }

    return (
        <>
            <h1>WINS: {wins}</h1>
            {/** Boutons de choix */}
            <div className="flex gap-3">
                { choices.map((item: any, key: number) => {
                    return (
                        <button 
                            key={key}
                            className={`btn text-5xl ${ choice == key ? " border-red-500 shadow" : "" }`}
                            onClick={() => setChoice(key)}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </div>
            {/** Bouton de validation (Prêt !) */}
            <button className="btn bg-green-500 text-white" onClick={handleReady}>Valider</button>
            { winner != "" && <span>{ winner }</span>}
        </>
    )
}