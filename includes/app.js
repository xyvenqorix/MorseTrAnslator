"use strict";


/*
    MORSE//NET

    Conversor automático:
    TEXTO <-> MORSE

    Morse NO es cifrado seguro.
    Es simplemente un sistema de
    representación de caracteres.
*/


const MORSE = {

    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",

    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",

    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    "_": "..--.-",
    "\"": ".-..-.",
    "$": "...-..-",
    "@": ".--.-."
};


/* TABLA INVERSA */

const REVERSE_MORSE = {};

for (
    const [letter, code]
    of Object.entries(MORSE)
) {

    REVERSE_MORSE[code] =
        letter;

}


/* ELEMENTOS */

const inputText =
    document.getElementById(
        "inputText"
    );

const outputText =
    document.getElementById(
        "outputText"
    );

const copyBtn =
    document.getElementById(
        "copyBtn"
    );

const pasteBtn =
    document.getElementById(
        "pasteBtn"
    );

const clearBtn =
    document.getElementById(
        "clearBtn"
    );

const swapBtn =
    document.getElementById(
        "swapBtn"
    );

const inputCounter =
    document.getElementById(
        "inputCounter"
    );

const outputCounter =
    document.getElementById(
        "outputCounter"
    );

const inputStatus =
    document.getElementById(
        "inputStatus"
    );

const outputStatus =
    document.getElementById(
        "outputStatus"
    );

const liveStatus =
    document.getElementById(
        "liveStatus"
    );


/* NORMALIZAR */

function normalizeText(text) {

    return text
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toUpperCase();

}


/* TEXTO → MORSE */

function textToMorse(text) {

    const normalized =
        normalizeText(text);

    return normalized
        .split(/\s+/)
        .filter(Boolean)
        .map(word => {

            return word
                .split("")
                .map(character => {

                    return (
                        MORSE[character]
                        ||
                        character
                    );

                })
                .join(" ");

        })
        .join(" / ");

}


/* MORSE → TEXTO */

function morseToText(morse) {

    return morse
        .trim()
        .split(
            /\s*\/\s*/
        )
        .map(word => {

            return word
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map(code => {

                    return (
                        REVERSE_MORSE[code]
                        ||
                        ""
                    );

                })
                .join("");

        })
        .join(" ");

}


/* DETECTAR MORSE */

function looksLikeMorse(text) {

    const clean =
        text.trim();

    if (!clean) {
        return false;
    }

    /*
        Si contiene letras,
        lo consideramos texto.
    */

    if (
        /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/
            .test(clean)
    ) {

        return false;

    }


    /*
        Morse solamente puede
        contener puntos, guiones,
        espacios y /
    */

    return (
        /^[.\-\/\s]+$/.test(clean)
        &&
        /[.-]/.test(clean)
    );

}


/* CONTADORES */

function updateCounters() {

    inputCounter.textContent =
        inputText.value.length;

    outputCounter.textContent =
        outputText.value.length;

}


/* CAMBIAR LIVE */

function setLive(status) {

    liveStatus.textContent =
        status;

}


/* CONVERSIÓN */

function convert() {

    const value =
        inputText.value;


    /*
        SIN TEXTO
    */

    if (!value.trim()) {

        outputText.value = "";

        inputStatus.textContent =
            "READY";

        outputStatus.textContent =
            "WAITING";

        setLive(
            "● WAIT"
        );

        updateCounters();

        return;
    }


    /*
        MORSE
    */

    if (
        looksLikeMorse(value)
    ) {

        outputText.value =
            morseToText(value);

        inputStatus.textContent =
            "MORSE";

        outputStatus.textContent =
            "TEXT";

        setLive(
            "● MORSE"
        );

    }


    /*
        TEXTO
    */

    else {

        outputText.value =
            textToMorse(value);

        inputStatus.textContent =
            "TEXT";

        outputStatus.textContent =
            "MORSE";

        setLive(
            "● TEXT"
        );

    }


    updateCounters();

}


/* COPIAR */

async function copyOutput() {

    if (!outputText.value) {
        return;
    }

    try {

        await navigator
            .clipboard
            .writeText(
                outputText.value
            );

    } catch {

        outputText.select();

        document.execCommand(
            "copy"
        );

    }


    copyBtn.textContent =
        "✓ COPIADO";


    setTimeout(() => {

        copyBtn.textContent =
            "COPIAR";

    }, 1200);

}


/* PEGAR */

async function pasteInput() {

    try {

        const text =
            await navigator
                .clipboard
                .readText();

        inputText.value =
            text;

        convert();

        inputText.focus();

    } catch {

        inputText.focus();

    }

}


/* LIMPIAR */

function clearAll() {

    inputText.value = "";

    outputText.value = "";

    inputStatus.textContent =
        "READY";

    outputStatus.textContent =
        "WAITING";

    setLive(
        "● WAIT"
    );

    updateCounters();

    inputText.focus();

}


/* INTERCAMBIAR */

function swapValues() {

    const input =
        inputText.value;

    inputText.value =
        outputText.value;

    outputText.value =
        input;

    inputStatus.textContent =
        "SWAPPED";

    outputStatus.textContent =
        "SWAPPED";

    setLive(
        "● SWAP"
    );

    updateCounters();

}


/* EVENTOS */

inputText.addEventListener(
    "input",
    convert
);

copyBtn.addEventListener(
    "click",
    copyOutput
);

pasteBtn.addEventListener(
    "click",
    pasteInput
);

clearBtn.addEventListener(
    "click",
    clearAll
);

swapBtn.addEventListener(
    "click",
    swapValues
);


/* INICIO */

updateCounters();

setLive(
    "● WAIT"
);
