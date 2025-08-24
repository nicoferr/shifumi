import { useContext, useState } from "react";
import { ChoicesContext } from "../providers/ChoicesProvider";

export default function Player(props: any) {

    const { player_number } = props;
    const choices = useContext(ChoicesContext);

    const [ choice, setChoice ] = useState(-1);
    const [ winner, setWinner ] = useState("");


    const getWinner = (playerChoice: number, computerChoice: number) => {

        const player = choices[playerChoice];
        const computer = choices[computerChoice];

        if (player.beats == computerChoice) {
            return `${player.value} beats ${computer.value}. Player 1 WINS !`
        }
        
        if (computer.beats == playerChoice) {
            return `${computer.value} beats ${player.value}. Computer WINS !`
        }

        return "This is a draw !"


    }


    const handleReady = () => {
        // Tour de l'ordinateur
        const computerChoice = Math.floor(Math.random() * 3); // Get a number between 0 & 2 so 0, 1 or 2

        setWinner(getWinner(choice, computerChoice));
    }

    return (
        <>
            <h1>Player {player_number} (you)</h1>
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