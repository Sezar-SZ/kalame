import txt_words from "./5-letters-words.txt";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
    const [word, setWord] = useState("");

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
            <h2>hello word</h2>
            <h2>{word}</h2>
        </div>
    );
};

export default App;
