import { inputField, lastAnswerElement, inputList, history, fieldIndex, setFieldIndex, decrementFieldIndex, listIndex, incrementListIndex, decrementListIndex, setListIndex, CE, clearAll, insertInputFieldValue, insertLastAnswerValue, addValue} from './script.js';

let historyActive = false;
let historyIndex = 0;

export function isHistoryActive() {
    return historyActive;
}

export function toggleHistoryActive() {
    historyActive = !historyActive;
}

export function executeHelper(buttonValue){
    if (buttonValue === "AC") {
        clearAll();
    } else if (buttonValue === "CE") {
        CE();
    } else if(buttonValue === "backspace") {
        removeLastDigit();
    } else if (buttonValue === "larr") {
        if (historyActive) recallHistory(-1);
        else handleJump("backward");
    } else if (buttonValue === "rarr") {
        if (historyActive) recallHistory(1);
        else handleJump("forward");
    } else if (buttonValue === "history") {
        historyPrepare();
    }
    return;
}

function recallHistory(step) {
    if (!history || history.size === 0) return;

    historyIndex += step;

    if (historyIndex < 0) {
        historyIndex = history.size - 1;
    } else if (historyIndex >= history.size) {
        historyIndex = 0;
    }

    const entries = Array.from(history.entries());
    const [expression, result] = entries[historyIndex];

    CE();

    insertInputFieldValue(expression);
    console.log(expression, " ", inputField.value);
    if (lastAnswerElement) {
        console.log("in last answer")
        insertLastAnswerValue(Number(result));
    }
    return;
}

function historyPrepare() {
    CE();
    if (historyActive) {
        toggleHistoryActive();
    } else {
        historyActive = true;
        historyIndex = history.size - 1;
        recallHistory(0);
    }
    return;
}

function removeLastDigit() {
    if (historyActive) {
        CE();
        historyActive = false;
        historyIndex = 0;
        return;
    }
    if (fieldIndex === 0 || inputField.value.length === 0 || /^[A-Za-z]$/.test(inputField.value)) {
        CE();
        return;
    }

    if (listIndex > 0) {
        inputList.splice(listIndex - 1, 1);
        decrementListIndex();
    }

    if (inputField.value[fieldIndex - 1] === "n" || inputField.value[fieldIndex - 1] === "s") {
        inputField.value = inputField.value.slice(0, fieldIndex - 3) + inputField.value.slice(fieldIndex);
        setFieldIndex(fieldIndex - 3);
    }
    else if(/[0-9+\-*/√^%.()\s]$/.test(inputField.value[inputField.value.length - 1])) {
        inputField.value = inputField.value.slice(0, fieldIndex - 1) + inputField.value.slice(fieldIndex);
        decrementFieldIndex();
    } else {
        CE();
    }
    setFieldFocus(fieldIndex, listIndex);
}

export function valueFormatter(rawValue) {
    if (rawValue === 0) return 0;

    const formattedValue = rawValue.toPrecision(10);
    return parseFloat(formattedValue);
}

export function setFieldFocus(fieldIndex, listIndex){ 
    if(isNaN(fieldIndex) || fieldIndex > inputField.value.length){
        fieldIndex = 0;
        listIndex = 0;
    }
    if (fieldIndex < 0) {
        fieldIndex = inputField.value.length;
        listIndex = inputList.length;
    }
    inputField.setSelectionRange(fieldIndex,fieldIndex);
    setFieldIndex(fieldIndex);
    setListIndex(listIndex);
    inputField.focus();
}

function handleJump(direction) {
    if (inputField.value === "") return;
    if (direction === "backward") {
        if (fieldIndex === 0) {
            setFieldFocus(inputField.value.length, 0);
            return;
        }
        let currentPointerLastValue = inputField.value[fieldIndex - 1];
        let secondLastValue = inputField.value[fieldIndex - 2];
        if (currentPointerLastValue === "(") {
            if (secondLastValue === "n" || secondLastValue === "s") {
                setFieldFocus(fieldIndex - 4, listIndex - 2);
            } else if (secondLastValue === "√") {
                setFieldFocus(fieldIndex - 2, listIndex - 2);
            } else {
                setFieldFocus(fieldIndex -1, listIndex - 1);
            }
        } else if (currentPointerLastValue === "s") {
            setFieldFocus(fieldIndex - 3, listIndex - 1);
        } else {
            setFieldFocus(fieldIndex - 1, listIndex - 1);
        }
    } else if (direction === "forward") {
        if (fieldIndex === inputField.value.length) {
            setFieldFocus(0, 0);
            return;
        }
        let currentValue = inputField.value[fieldIndex];
        if (currentValue === "s" || currentValue === "c" || currentValue === "t") {
            setFieldFocus(fieldIndex + 4, listIndex + 2);
        } else if (currentValue === "√") {
            setFieldFocus(fieldIndex + 2, listIndex + 2);
        } else if (currentValue === "A") {
            setFieldFocus(fieldIndex + 3, listIndex + 1);
        } else {
            setFieldFocus(fieldIndex + 1, listIndex + 1);
        }
    } else {
        return;
    }
}