import txt_words from "./5-letters-words.txt";
import { useEffect, useState } from "react";
import "./App.css";
import useKeyPress from "./hooks/useKeyPress";

const App = () => {
    const [word, setWord] = useState("");
    const [wordLetterFrequency, setWordLetterFrequency] = useState(new Map());
    const [gameMap, setGameMap] = useState([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ]);
    const [cellsClassNames, setCellsClassNames] = useState([
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

            let letterFreq = new Map();
            for (let i = 0; i < randomWord.length; i++) {
                if (letterFreq.get(randomWord[i]))
                    letterFreq.set(
                        randomWord[i],
                        letterFreq.get(randomWord[i]) + 1
                    );
                else letterFreq.set(randomWord[i], 1);
            }
            setWordLetterFrequency(letterFreq);
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

                const guessedLetters = new Map();
                const greenCells = [];
                for (let i = 0; i < guessedWord.length; i++) {
                    if (guessedWord[i] === word[i]) {
                        greenCells.push(i);
                        let newCellsClassName = cellsClassNames;
                        newCellsClassName[currentRow][i] = "green";
                        setCellsClassNames(newCellsClassName);
                        if (!guessedLetters.get(guessedWord[i])) {
                            guessedLetters.set(guessedWord[i], 1);
                        } else
                            guessedLetters.set(
                                guessedWord[i],
                                guessedLetters.get(guessedLetters[i]) + 1
                            );
                    }
                }

                for (let i = 0; i < guessedWord.length; i++) {
                    if (!greenCells.includes(i)) {
                        if (word.includes(guessedWord[i])) {
                            if (
                                !guessedLetters.get(guessedWord[i]) ||
                                guessedLetters.get(guessedWord[i]) <
                                    wordLetterFrequency.get(guessedWord[i])
                            ) {
                                let newCellsClassName = cellsClassNames;
                                newCellsClassName[currentRow][i] = "yellow";
                                setCellsClassNames(newCellsClassName);
                                if (isNaN(guessedLetters.get(guessedWord[i])))
                                    guessedLetters.set(guessedWord[i], 1);
                                else
                                    guessedLetters.set(
                                        guessedWord[i],
                                        guessedLetters.get(guessedWord[i]) + 1
                                    );
                            }
                        } else {
                            let newCellsClassName = cellsClassNames;
                            newCellsClassName[currentRow][i] = "gray";
                            setCellsClassNames(newCellsClassName);
                        }
                    }
                }
                setCurrentRow(currentRow + 1);
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
                    {gameMap.map((row, row_indx) => (
                        <div className="row">
                            {row.map((cell, cell_indx) => (
                                <div
                                    className={`cell ${cellsClassNames[row_indx][cell_indx]}`}
                                >
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
