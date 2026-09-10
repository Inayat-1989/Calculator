export function buttonPressed(clickedButton) {
    if (clickedButton.classList.contains("operator")) {
        if (clickedButton.innerText === "×") return ["*", null];
        else if (clickedButton.innerText === "÷") return ["/", null];
    } else if (clickedButton.classList.contains("functions")) {
        if (clickedButton.id === "answer") return ['ans', null];
        else if (clickedButton.id === "square") return ["**", "2"];
        else if (clickedButton.id === "sin") return ["sin", "("];
        else if (clickedButton.id === "cos") return ["cos", "("];
        else if (clickedButton.id === "tan") return ["tan", "("];
        else if (clickedButton.id === "sqrt") return ["sqrt", "("];
    } else if (clickedButton.classList.contains("helper")) {
        return [null, null];
    }

    return [clickedButton.innerText, null];
}