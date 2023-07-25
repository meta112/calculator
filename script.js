class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement, pastCalculations, pastAnswers){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.pastCalculations = pastCalculations;
        this.pastAnswers = pastAnswers;
        this.clear();
        this.justPressedEquals = false;
    }

    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    getDisplayNum(num){
        const stringnum = num.toString();
        const intdig = stringnum.split('.')[0];
        const decdig = stringnum.split('.')[1];
        let intdisplay;
        if (intdig === '-'){
            intdisplay = '-';
        } else if (isNaN(parseFloat(intdig))){
            intdisplay = '';
        } else {
            intdisplay = parseFloat(intdig).toLocaleString('en', {maximumFractionDigits: 0});
        }
        if (decdig) return `${intdisplay}.${decdig}`;
        if (stringnum.includes('.')) intdisplay += '.';
        return intdisplay;
    }

    appendNumber(number){
        if (this.justPressedEquals){
            this.currentOperand = number.toString();
            this.justPressedEquals = false;
        } else if (number === '.' && this.currentOperand.includes('.')) {
            return;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
    }

    chooseOperation(operation){
        if (this.currentOperand === '' || isNaN(parseFloat(this.currentOperand))) {
            if (this.previousOperand !== ''){
                this.operation = operation;
            }
            return;
        }
        if (this.previousOperand !== ''){
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.justPressedEquals = false;
        

    }

    compute(){
        let result;
        let a = parseFloat(this.previousOperand);
        let b = parseFloat(this.currentOperand);
        if (isNaN(a) || isNaN(b)) {
            this.clear();
            return;
        }

        switch(this.operation){
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                result = a / b;
                break;
            case 'mod':
                result = a % b;
                break;
            case '^':
                result = a**b;
                break;
            default:
                return;
        }

        this.currentOperand = result.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay(){
            this.currentOperandTextElement.innerText = this.getDisplayNum(this.currentOperand);
        
        if (this.operation) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNum(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }

    }

    applyNegative(){
        if (this.currentOperand === '-'){
            this.delete();
            this.updateDisplay();
        } else if (this.currentOperand === '' || this.justPressedEquals){
            this.currentOperand = '-';
            this.justPressedEquals = false;
            this.updateDisplay();
        }
    }

    specialNumber(number){
        if (number.toString() === 'e') number = Math.E;
        else if (number.toString() === 'pi') number = Math.PI;

        if (this.justPressedEquals || this.currentOperand === ''){
            this.currentOperand = number.toString();
            this.justPressedEquals = false;
        } else if (this.currentOperand === '-'){
            number *= (-1);
            this.currentOperand = number.toString();
            this.justPressedEquals = false;
        } else if (!(isNaN(parseFloat(this.currentOperand))) && parseFloat(this.currentOperand) != 0) {
            number *= parseFloat(this.currentOperand);
            this.currentOperand = number.toString();
            this.justPressedEquals = false;
        } 


    }
}

const allClearButton = document.querySelector('[data-ac]');
const numberButtons = document.querySelectorAll("[data-num]");
const deleteButton = document.querySelector('[data-del]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const negativeButton = document.querySelector('[data-neg]');
const piButton = document.querySelector('[data-pi]');
const eButton = document.querySelector('[data-e]');
const currentOperandTextElement = document.querySelector('[data-cur-operand]');
const previousOperandTextElement = document.querySelector('[data-prev-operand]');
const historyButton = document.querySelector('[data-history]');
const history = document.getElementById('history-modal');

const pastCalculations = document.querySelectorAll('[data-history-calculation]');
const pastAnswers = document.querySelectorAll('[data-history-answer]');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, pastCalculations);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        button.blur();
    })
})

operationButtons.forEach(operation => {
    operation.addEventListener('click', () => {
        calculator.chooseOperation(operation.innerText);
        calculator.updateDisplay();
        operation.blur()
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    calculator.justPressedEquals = true;
    equalsButton.blur();
} )

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    allClearButton.blur()
    calculator.justPressedEquals = false;
}
)

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    deleteButton.blur();
})

negativeButton.addEventListener('click', () => {
    calculator.applyNegative();
    calculator.updateDisplay();
    negativeButton.blur();
})

piButton.addEventListener('click', () => {
    calculator.specialNumber('pi');
    calculator.updateDisplay();
    piButton.blur();
})

eButton.addEventListener('click', () => {
    calculator.specialNumber('e');
    calculator.updateDisplay();
    eButton.blur();
})

