import txt_words from "./5-letters-words.txt";
import { useEffect, useState } from "react";
import "./App.css";
import useKeyPress from "./hooks/useKeyPress";
import Keyboard from "./keyboard";

const App = () => {
    const [score, setScore] = useState("");
    const [highScore, setHighScore] = useState("");

    const [wordsList, setWordsList] = useState([]);
    const [word, setWord] = useState("");
    const [wordLetterFrequency, setWordLetterFrequency] = useState(new Map());

    const [greenLetters, setGreenLetters] = useState([]);
    const [yellowLetters, setYellowLetters] = useState([]);
    const [grayLetters, setGrayLetters] = useState([]);

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

    const [message, setMessage] = useState("");

    const getData = () => {
        const data = JSON.parse(localStorage.getItem("data")) || {
            score: 0,
            highScore: 0,
        };
        setScore(data["score"]);
        setHighScore(data["highScore"]);
    };
    const setData = (data) => {
        localStorage.setItem("data", JSON.stringify(data));
    };

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

            const words = data.split("\n").map((element) => element.trim());
            setWordsList(words);
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex];
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
        getData();
    }, []);

    useKeyPress((key) => {
        let newGameMap = [...gameMap];
        if (key.length === 1 && key !== " ") {
            const letterIndex = getNextLetterIndex();
            if (letterIndex !== -1 && letterIndex[0] === currentRow) {
                newGameMap[letterIndex[0]][letterIndex[1]] = key;
            }
        } else if (key === "Backspace") {
            let newGameMap = [...gameMap];
            const letterIndex = getLastLetterIndex();
            if (letterIndex !== -1 && letterIndex[0] === currentRow) {
                newGameMap[letterIndex[0]][letterIndex[1]] = "";
            }
        } else if (key === "Enter") {
            const guessedWord = getGuessedWord(currentRow);
            if (
                !gameMap[currentRow].includes("") &&
                currentRow <= 5 &&
                wordsList.includes(guessedWord)
            ) {
                const guessedLetters = new Map();
                const greenCells = [];
                let newGreenLetters = [...greenLetters];
                for (let i = 0; i < guessedWord.length; i++) {
                    if (guessedWord[i] === word[i]) {
                        greenCells.push(i);

                        newGreenLetters.push(guessedWord[i]);

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

                let newGrayLetters = [...grayLetters];
                let newYellowLetters = [...yellowLetters];
                for (let i = 0; i < guessedWord.length; i++) {
                    if (!greenCells.includes(i)) {
                        if (word.includes(guessedWord[i])) {
                            if (
                                !guessedLetters.get(guessedWord[i]) ||
                                guessedLetters.get(guessedWord[i]) <
                                    wordLetterFrequency.get(guessedWord[i])
                            ) {
                                newYellowLetters.push(guessedWord[i]);

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
                            } else {
                                newGrayLetters.push(guessedWord[i]);

                                let newCellsClassName = cellsClassNames;
                                newCellsClassName[currentRow][i] = "gray";
                                setCellsClassNames(newCellsClassName);
                            }
                        } else {
                            newGrayLetters.push(guessedWord[i]);

                            let newCellsClassName = cellsClassNames;
                            newCellsClassName[currentRow][i] = "gray";
                            setCellsClassNames(newCellsClassName);
                        }
                    }
                }
                setGreenLetters(newGreenLetters);
                setYellowLetters(newYellowLetters);
                setGrayLetters(newGrayLetters);

                if (guessedWord === word) {
                    setData({
                        score: score + 1,
                        highScore:
                            score + 1 > highScore ? score + 1 : highScore,
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else if (currentRow === 5 && guessedWord !== word) {
                    setData({
                        score: 0,
                        highScore: highScore,
                    });
                    setMessage(word);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
                setCurrentRow(currentRow + 1);
            } else {
                setMessage("کلمه در لیست نیست");
                setTimeout(() => {
                    setMessage("");
                }, 1000);
            }
        }
        setGameMap(newGameMap);
    });

    useEffect(() => {
        // console.log(word);
    }, [word]);

    return (
        <div className="App">
            <div className="header" dir="rtl">
                <div className="score">
                    <h3>امتیاز فعلی:</h3>
                    <span>{score}</span>
                </div>
                <h1>کـلــمــه</h1>
                <div className="score">
                    <h3>بیشترین امتیاز:</h3>
                    <span>{highScore}</span>
                </div>
            </div>
            <div className="game">
                <div
                    className="message"
                    style={{ opacity: message ? "100" : "0" }}
                >
                    <p dir="rtl">{message}</p>
                </div>
                <div className="map">
                    {gameMap.map((row, row_indx) => (
                        <div className="row" key={row_indx}>
                            {row.map((cell, cell_indx) => (
                                <div
                                    key={cell_indx}
                                    className={`cell ${cellsClassNames[row_indx][cell_indx]}`}
                                >
                                    <h3>{cell}</h3>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <Keyboard
                green={greenLetters}
                yellow={yellowLetters}
                gray={grayLetters}
            />
        </div>
    );
};

export default App;
