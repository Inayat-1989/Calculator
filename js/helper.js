import { inputField, lastAnswerElement, inputList, history, fieldIndex, setFieldIndex, decrementFieldIndex, listIndex, incrementListIndex, decrementListIndex, setListIndex, CE, clearAll, clearingAns, insertInputFieldValue} from './script.js';

let historyActive = false;
let historyIndex = 0;

export function executeHelper(buttonValue){
    // AC Clears All.
    if (buttonValue === "AC") {
        clearAll();
    } else if (buttonValue === "CE") { // Clears only the visibile and the list for expression.
        CE();
    } else if(buttonValue === "backspace") { // Pops and removes the last inserted digit.
        removeLastDigit();
    } else if (buttonValue === "larr") { // Moves the cursor to the left by one position.
        if (historyActive) recallHistory(-1);
        else handleJump("backward");
    } else if (buttonValue === "rarr") { // Moves the cursor to the right by one position.
        if (historyActive) recallHistory(1);
        else handleJump("forward");
    } else if (buttonValue === "history") {
        historyPrepare();
    }
}

function recallHistory(step) {
    historyIndex = historyIndex + step;

    if (historyIndex === -1) {
        historyIndex = history.size - 1;
    } else if (historyIndex === history.size) {
        historyIndex = 0;
    }

    let currentIndex = 0;
    // const [key, value] = history[historyIndex];
    // inputField.value = key;
    // lastAnswerElement.value = Number(value);
    for (const [key, value] of history) {
        if (currentIndex === historyIndex) {
            inputField.value = key;
            lastAnswerElement.value = Number(value);
        } 
        currentIndex++;
    }
    console.log("Map: ", history, "\nSize: ", history.size,"\nIndex: ", historyIndex, "\nActive Status: ", historyActive); 
}

function historyPrepare() {
    CE();
    if (historyActive) historyActive = false;
    else {
        historyActive = true;
        historyIndex = history.size;
        recallHistory(0);
    }
}

function removeLastDigit() {
    if (historyActive) {
        insertInputFieldValue("");
        historyActive = false;
        historyIndex = 0;
    }
    if (fieldIndex === 0) {
        return;
    }
    console.log("Before:\nInputList: ", inputList,"\nList Index: ", listIndex, "\nInputField: ", inputField.value, "\nField Index: ", fieldIndex);
    inputList.splice(listIndex - 1,1);
    decrementListIndex();

    clearingAns();

    // Checks if the last digit is a function then it would remove the whole function. n for sin and tan and s for cos.
    if (inputField.value[fieldIndex - 1] === "n" || inputField.value[fieldIndex - 1] === "s") {
        inputField.value = inputField.value.slice(0, fieldIndex - 3) + inputField.value.slice(fieldIndex);
        setFieldIndex(fieldIndex - 3);
    }
    else if(/[0-9+\-*/√^%.()\s]$/.test(inputField.value[inputField.value.length -1])) { // removes only one digit if it is a normal character.
        inputField.value = inputField.value.slice(0, fieldIndex - 1) + inputField.value.slice(fieldIndex);
        decrementFieldIndex();
    } else {
        CE();
    }
    setFieldFocus(fieldIndex, listIndex);

    console.log("After:\nInputList: ", inputList,"\nList Index: ", listIndex, "\nInputField: ", inputField.value, "\nField Index: ", fieldIndex);

    // pops the last digit, as functions are inserted as a single value in the inputList array, so we don't need to worry about removing the whole function from the inputList array.
    // decrementFieldIndex();
}

export function valueFormatter(rawValue) {
    if (rawValue === 0) return 0;

    const formattedValue = rawValue.toPrecision(3);

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
    console.log("Index from Set Field Focus:", fieldIndex,"\nInput Field Lenght: ", inputField.value.length);
    inputField.setSelectionRange(fieldIndex,fieldIndex);
    setFieldIndex(fieldIndex);
    setListIndex(listIndex);
    inputField.focus();
}

function handleJump(direction) {
    console.log("Before Index:", fieldIndex);
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
        console.log("After Index:", fieldIndex);
    } else if (direction === "forward") {
        if (fieldIndex === inputField.value.length) {
            setFieldFocus(0, 0);
            return;
        }
        let currentValue = inputField.value[fieldIndex];
        // let secondValue = inputField.value[fieldIndex + 1];
        if (currentValue === "s" || currentValue === "c" || currentValue === "t") {
            setFieldFocus(fieldIndex + 4, listIndex + 2);
        } else if (currentValue === "√") {
            setFieldFocus(fieldIndex + 2, listIndex + 2);
        } else if (currentValue === "A") {
            setFieldFocus(fieldIndex + 3, listIndex + 1);
        } else {
            setFieldFocus(fieldIndex + 1, listIndex + 1);
        }
        console.log("After Index:", fieldIndex);
    } else {
        return;
    }
}