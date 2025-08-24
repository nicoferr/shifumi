import { createContext } from "react";

export const ChoicesContext = createContext<{ beats: number, value: string, label: string}[]>([]);

export default function ChoicesProvider(props:any) {
    
    const choices = [
        { beats: 2, value: "rock", label: "👊" }, 
        { beats: 0, value: "paper", label: "✋" }, 
        { beats: 1, value: "scissors", label: "✌" }, 
    ]

    return (
        <ChoicesContext.Provider value={choices}>
            {props.children}
        </ChoicesContext.Provider>
    )
}