import txt_words from "./5-letters-words.txt";
import { useEffect, useState } from "react";
import "./App.css";
import useKeyPress from "./hooks/useKeyPress";

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
    const [currentRow, setCurrentRow] = useState(0);

    const getNextLetterIndex = () => {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                if (gameMap[i][j] === "") {
                    return [i, j];
                }
            }
        }
        return -1;
    };
    const getLastLetterIndex = () => {
        for (let i = 5; i >= 0; i--) {
            for (let j = 4; j >= 0; j--) {
                if (gameMap[i][j] !== "") return [i, j];
            }
        }
        return -1;
    };

    const getGuessedWord = (row) => {
        let guessedWord = "";
        gameMap[row].forEach((letter) => {
            guessedWord += letter;
        });
        return guessedWord;
    };

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

    useKeyPress((key) => {
        if (key.length === 1 && key !== " ") {
            let newGameMap = [...gameMap];
            const letterIndex = getNextLetterIndex();
            if (letterIndex !== -1 && letterIndex[0] === currentRow) {
                newGameMap[letterIndex[0]][letterIndex[1]] = key;
                setGameMap(newGameMap);
            }
        } else if (key === "Backspace") {
            let newGameMap = [...gameMap];
            const letterIndex = getLastLetterIndex();
            if (letterIndex !== -1 && letterIndex[0] === currentRow) {
                newGameMap[letterIndex[0]][letterIndex[1]] = "";
            }
        } else if (key === "Enter") {
            if (!gameMap[currentRow].includes("") && currentRow <= 5) {
                const guessedWord = getGuessedWord(currentRow);
                setCurrentRow(currentRow + 1);
                console.log("enter accepted, word is", guessedWord);
                // logic of the game...
                // for styles can have an array of classnames for each cell
            }
        }
    });

    useEffect(() => {
        console.log(word);
    }, [word]);

    return (
        <div className="App">
            <div className="header">
                <h1>کـلــمــه</h1>
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
