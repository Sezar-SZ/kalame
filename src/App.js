import txt_words from "./5-letters-words.txt";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
    const [word, setWord] = useState("");
    const [gameMap, setGameMap] = useState([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ]);

    const getNewWord = async () => {
        try {
            const res = await fetch(txt_words);
            const data = await res.text();

            const words = data.split("\n");
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex].trim();
            setWord(randomWord);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getNewWord();
    }, []);

    useEffect(() => {
        console.log(word);
    }, [word]);

    return (
        <div className="App">
            <div className="header">
                <h1>کلمه</h1>
            </div>
            <div className="game">
                <div className="map">
                    {gameMap.map((row) => (
                        <div className="row">
                            {row.map((cell) => (
                                <div className="cell">
                                    <h3>{cell}</h3>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
