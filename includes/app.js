"use strict";

/*
    MORSE//NET
    Texto <-> Morse

    Separación:
    palabras = " / "
    letras   = espacio
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
    Creamos automáticamente
    la tabla inversa.
*/

const REVERSE_MORSE = {};

Object.entries(MORSE).forEach(([letter, code]) => {
    REVERSE_MORSE[code] = letter;
});


/* ELEMENTOS */

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");
const autoBtn = document.getElementById("autoBtn");

const copyBtn = document.getElementById("copyBtn");
const pasteBtn = document.getElementById("pasteBtn");

const clearBtn = document.getElementById("clearBtn");
const swapBtn = document.getElementById("swapBtn");

const inputCounter = document.getElementById("inputCounter");
const outputCounter = document.getElementById("outputCounter");

const inputStatus = document.getElementById("inputStatus");
const outputStatus = document.getElementById("outputStatus");


/* NORMALIZAR TEXTO */

function normalizeText(text) {

    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

}


/* TEXTO → MORSE */

function textToMorse(text) {

    const normalized = normalizeText(text);

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


/* MORSE → TEXTO */

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

                    return REVERSE_MORSE[code] || "�";

                })
                .join("");

        })
        .join(" ");

}


/* DETECTAR SI ES MORSE */

function looksLikeMorse(text) {

    const clean = text.trim();

    if (!clean) {
        return false;
    }

    /*
        Morse solamente usa:
        puntos
        guiones
        espacios
        /
    */

    if (!/^[.\-\/\s]+$/.test(clean)) {
        return false;
    }

    /*
        Debe contener al menos
        un punto o un guion.
    */

    return /[.-]/.test(clean);

}


/* ACTUALIZAR CONTADORES */

function updateCounters() {

    inputCounter.textContent =
        `${inputText.value.length} caracteres`;

    outputCounter.textContent =
        `${outputText.value.length} caracteres`;

}


/* ESTADO */

function setStatus(element, text) {

    element.textContent = text;

}


/* CONVERTIR A MORSE */

function encode() {

    const text = inputText.value;

    if (!text.trim()) {

        outputText.value = "";

        setStatus(outputStatus, "WAITING");

        updateCounters();

        return;
    }

    outputText.value = textToMorse(text);

    setStatus(inputStatus, "ENCODED");
    setStatus(outputStatus, "MORSE READY");

    updateCounters();

}


/* DECODIFICAR MORSE */

function decode() {

    const morse = inputText.value;

    if (!morse.trim()) {

        outputText.value = "";

        setStatus(outputStatus, "WAITING");

        updateCounters();

        return;
    }

    outputText.value = morseToText(morse);

    setStatus(inputStatus, "MORSE DETECTED");
    setStatus(outputStatus, "TEXT READY");

    updateCounters();

}


/* AUTOMÁTICO */

function autoConvert() {

    const value = inputText.value.trim();

    if (!value) {

        outputText.value = "";

        setStatus(inputStatus, "WAITING");
        setStatus(outputStatus, "WAITING");

        updateCounters();

        return;
    }


    if (looksLikeMorse(value)) {

        decode();

    } else {

        encode();

    }

}


/* COPIAR */

async function copyOutput() {

    const text = outputText.value;

    if (!text) {
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "COPIADO ✓";

        setTimeout(() => {

            copyBtn.textContent = "COPIAR";

        }, 1500);

    } catch (error) {

        /*
            Fallback para navegadores
            que no permitan clipboard.
        */

        outputText.select();

        document.execCommand("copy");

        copyBtn.textContent = "COPIADO ✓";

        setTimeout(() => {

            copyBtn.textContent = "COPIAR";

        }, 1500);

    }

}


/* PEGAR */

async function pasteInput() {

    try {

        const text =
            await navigator.clipboard.readText();

        inputText.value = text;

        updateCounters();

        autoConvert();

    } catch (error) {

        inputText.focus();

    }

}


/* LIMPIAR */

function clearAll() {

    inputText.value = "";

    outputText.value = "";

    setStatus(inputStatus, "READY");
    setStatus(outputStatus, "WAITING");

    updateCounters();

    inputText.focus();

}


/* INTERCAMBIAR */

function swapValues() {

    const oldInput = inputText.value;

    inputText.value = outputText.value;

    outputText.value = oldInput;

    updateCounters();

    setStatus(inputStatus, "SWAPPED");
    setStatus(outputStatus, "SWAPPED");

}


/* EVENTOS */

encodeBtn.addEventListener(
    "click",
    encode
);


decodeBtn.addEventListener(
    "click",
    decode
);


autoBtn.addEventListener(
    "click",
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


inputText.addEventListener(
    "input",
    updateCounters
);


/*
    Ctrl + Enter
    convierte automáticamente.
*/

inputText.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            autoConvert();

        }

    }
);


/* INICIO */

updateCounters();
