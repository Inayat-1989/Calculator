import { lastAnswerElement } from './script.js';

export function buttonPressed(clickedButton) {
    // Handling each Class Accordingly.

    // Only multiply and divide are handled according to the accurate Javascript operators.
    if (clickedButton.classList.contains("operator")) {
        if (clickedButton.innerText === "×") return ["*", null];
        else if (clickedButton.innerText === "÷") return ["/", null];
    } else if (clickedButton.classList.contains("functions")) { // Handling all Functions except "(" and ")" becasuse the don't need any handling. 
        if (clickedButton.id === "answer") return ['Ans', null];
        else if (clickedButton.id === "square") return ["**", "2"];
        else if (clickedButton.id === "sin") return ["sin", "("];
        else if (clickedButton.id === "cos") return ["cos", "("];
        else if (clickedButton.id === "tan") return ["tan", "("];
        else if (clickedButton.id === "sqrt") return ["sqrt", "("];
    } else if (clickedButton.classList.contains("helper")) { // Helper Functions are handled automatically by direct button click or keyboard press.
        return [null, null];
    }

    // Returning a list of two the first as the primary value and the second as the secondary value if there is any, for example power sin and cos and sqrt all has secondary values either ( or 2.
    return [clickedButton.innerText, null];
}