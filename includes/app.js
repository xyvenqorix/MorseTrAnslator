"use strict";

/*
    MORSE//NET
    Conversor automático Texto <-> Morse

    No es un sistema de cifrado.
    Morse es un código de sustitución:
    A = .-
    B = -...
    etc.
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


/*
    TABLA INVERSA
*/

const REVERSE_MORSE = {};

Object.entries(MORSE).forEach(([letter, code]) => {

    REVERSE_MORSE[code] = letter;

});


/*
    ELEMENTOS
*/

const inputText =
    document.getElementById("inputText");

const outputText =
    document.getElementById("outputText");

const copyBtn =
    document.getElementById("copyBtn");

const pasteBtn =
    document.getElementById("pasteBtn");

const clearBtn =
    document.getElementById("clearBtn");

const swapBtn =
    document.getElementById("swapBtn");

const inputCounter =
    document.getElementById("inputCounter");

const outputCounter =
    document.getElementById("outputCounter");

const inputStatus =
    document.getElementById("inputStatus");

const outputStatus =
    document.getElementById("outputStatus");


/*
    NORMALIZAR TEXTO
*/

function normalizeText(text) {

    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

}


/*
    TEXTO → MORSE
*/

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

                    return MORSE[character] || character;

                })
                .join(" ");

        })
        .join(" / ");

}


/*
    MORSE → TEXTO
*/

function morseToText(morse) {

    const words = morse
        .trim()
        .split(/\s*\/\s*/);

    return words
        .map(word => {

            return word
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map(code => {

                    return REVERSE_MORSE[code] || "";

                })
                .join("");

        })
        .join(" ");

}


/*
    DETECTAR MORSE
*/

function looksLikeMorse(text) {

    const clean =
        text.trim();

    if (!clean) {
        return false;
    }

    /*
        Si tiene letras normales,
        claramente es texto.
    */

    if (/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(clean)) {
        return false;
    }

    /*
        Morse solamente:
        . - espacios /
    */

    return /^[.\-\/\s]+$/.test(clean)
        && /[.-]/.test(clean);

}


/*
    CONTADORES
*/

function updateCounters() {

    inputCounter.textContent =
        `${inputText.value.length} caracteres`;

    outputCounter.textContent =
        `${outputText.value.length} caracteres`;

}


/*
    ESTADOS
*/

function setStatus(element, text) {

    element.textContent = text;

}


/*
    CONVERSIÓN AUTOMÁTICA
*/

function autoConvert() {

    const value =
        inputText.value;

    if (!value.trim()) {

        outputText.value = "";

        setStatus(
            inputStatus,
            "READY"
        );

        setStatus(
            outputStatus,
            "WAITING"
        );

        updateCounters();

        return;
    }


    /*
        MORSE
    */

    if (looksLikeMorse(value)) {

        outputText.value =
            morseToText(value);

        setStatus(
            inputStatus,
            "MORSE"
        );

        setStatus(
            outputStatus,
            "TEXT READY"
        );

    }

    /*
        TEXTO
    */

    else {

        outputText.value =
            textToMorse(value);

        setStatus(
            inputStatus,
            "TEXT"
        );

        setStatus(
            outputStatus,
            "MORSE READY"
        );

    }


    updateCounters();

}


/*
    COPIAR
*/

async function copyOutput() {

    const text =
        outputText.value;

    if (!text) {
        return;
    }

    try {

        await navigator.clipboard
            .writeText(text);

    } catch {

        outputText.select();

        document.execCommand("copy");

    }

    copyBtn.textContent =
        "COPIADO ✓";

    setTimeout(() => {

        copyBtn.textContent =
            "COPIAR";

    }, 1500);

}


/*
    PEGAR
*/

async function pasteInput() {

    try {

        const text =
            await navigator.clipboard
                .readText();

        inputText.value =
            text;

        autoConvert();

        inputText.focus();

    } catch {

        inputText.focus();

    }

}


/*
    LIMPIAR
*/

function clearAll() {

    inputText.value = "";

    outputText.value = "";

    setStatus(
        inputStatus,
        "READY"
    );

    setStatus(
        outputStatus,
        "WAITING"
    );

    updateCounters();

    inputText.focus();

}


/*
    INTERCAMBIAR
*/

function swapValues() {

    const oldInput =
        inputText.value;

    inputText.value =
        outputText.value;

    outputText.value =
        oldInput;

    setStatus(
        inputStatus,
        "SWAPPED"
    );

    setStatus(
        outputStatus,
        "SWAPPED"
    );

    updateCounters();

}


/*
    EVENTOS
*/


inputText.addEventListener(
    "input",
    autoConvert
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


/*
    INICIO
*/

updateCounters();
