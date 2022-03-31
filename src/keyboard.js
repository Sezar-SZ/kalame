import { useEffect } from "react";
import "./keyboard.css";

const Keyboard = ({ green, yellow, gray }) => {
    const keys_temp_1 = "ض ص ث ق ف غ ع ه خ ح ج چ پ";
    const keys_temp_2 = "ش س ی ب ل ا آ ت ن م ک گ";
    const keys_temp_3 = "Enter ظ ط ژ ز ر ذ د ئ ء و Backspace";

    const keys1 = keys_temp_1.split(" ");
    const keys2 = keys_temp_2.split(" ");
    const keys3 = keys_temp_3.split(" ");

    const onKeyClicked = (key) => {
        if (key !== "backspace") {
            window.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: `${key}`,
                })
            );
            window.dispatchEvent(
                new KeyboardEvent("keyup", {
                    key: `${key}`,
                })
            );
        } else {
            window.dispatchEvent(
                new KeyboardEvent("keypressed", {
                    key: "Backspace",
                })
            );
            window.dispatchEvent(
                new KeyboardEvent("keyup", {
                    key: "Backspace",
                })
            );
        }
    };

    const colorClassProvider = (key) => {
        if (green.includes(key)) return "green";
        else if (yellow.includes(key)) return "yellow";
        else if (gray.includes(key)) return "gray";
    };

    return (
        <div className="keyboard">
            <div className="keyboard-row row-1">
                {keys1.map((element) => (
                    <div
                        className={`keyboard-key ${element} ${colorClassProvider(
                            element
                        )}`}
                        style={{}}
                        onClick={() => {
                            onKeyClicked(element);
                        }}
                    >
                        <span>{element}</span>
                    </div>
                ))}
            </div>
            <div className="keyboard-row row-2">
                {keys2.map((element) => (
                    <div
                        className={`keyboard-key ${element} ${colorClassProvider(
                            element
                        )}`}
                        onClick={() => {
                            onKeyClicked(element);
                        }}
                    >
                        <span>{element}</span>
                    </div>
                ))}
            </div>
            <div className="keyboard-row row-3">
                {keys3.map((element) => (
                    <div
                        className={`keyboard-key ${element} ${colorClassProvider(
                            element
                        )}`}
                        onClick={() => {
                            onKeyClicked(element);
                        }}
                    >
                        <span>{element}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Keyboard;
