import React, { useReducer } from 'react';
import DigitButton from './DigitButton'
import OperationButton from './OperationButton';
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      // check if the currentOperand is overwrite (prevent adding digfit to the evaluate value in currentOperand)
      if(state.overwrite) {
        return {
          ...state,
          currentOperand:  payload.digit,
          overwrite: false,
        }
      }
      // if currentOperand is 0 and the value of button is 0 then return the current state (means 0)
      if(payload.digit === "0" && state.currentOperand === "0") return state
      //if the payload has . then don't add anopther .
      if(payload.digit === "." && state.currentOperand.includes(".")) return state
      //if the payload.digits has 3 number

      return {
        // get the state and spread it
        ...state,
        //Replace the currentOperand
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      //is currentoperand and previousOperand is null then return the current state or (0)
      if(state.currentOperand ==  null && state.previousOperand == null) {
        return state
      }

      //if the user click the wronfg ooperation this will update the operation
      if(state.currentOperand == null){
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      //Returning Empty State
      return {}
    case ACTIONS.DELETE_DIGIT:
      //deleteing the digit one by one
      //
      if(state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) return state
      
      if ( state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }

      return {
        ...state,
        // (0, -1) o means first indexedDB, -1 will removed the last index
        currentOperand: state.currentOperand.slice(0, -1)
      }

    
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

// Formulas
function evaluate({currentOperand, previousOperand, operation}) {
  const currentNum = parseFloat(currentOperand)
  const previousNum = parseFloat(previousOperand)
  if(isNaN(currentNum) || isNaN(previousNum)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = previousNum + currentNum
      break
    case "-":
      computation = previousNum - currentNum
      break
    case "*":
      computation = previousNum * currentNum
      break
    case "/":
      computation = previousNum / currentNum
      break
  }

  return computation.toString()
}

// Format  for adding quit
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  //if opearand is null return nothing
  if (operand == null) return
  //separting interger and decimal with '.'
  const [integer, decimal] = operand.split('.')
  //if decimal is null then return the interger with INTERGER_FORMATTER
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  //to show the decimal '.'
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  //To show the previous, current opreations / Rendering
  const [{ currentOperand, previousOperand, operation }, dispatch] =  useReducer(
    reducer,
    {}
  )
    
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        {/* calling currentOperand but the result will be in formatOperand */}
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button onClick={() => dispatch({type: ACTIONS.CLEAR})} className="span-two">AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      {/* Dispatch = {dispatch} is used when they are payload or need to transfer Data */}
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className="span-two">=</button>
    </div>
  );
}

export default App;
