import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

/**  NOTE:-  if you don't know what is useOf useMemo and useCallback then just consider things as normal arrow function and variable initialization.
For example:- for(useMemo)
  const calculatorButtons = useMemo(
    () => [
      ['C', 'D', '%', '/'],
      ['7', '8', '9', '*'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['0', '.', '='],
    ],
    [],
  )
  you can consider it as below.
   const calculatorButtons = [
      ['C', 'D', '%', '/'],
      ['7', '8', '9', '*'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['0', '.', '='],
    ];

For Example:- for(useCallback);
  const handleKeyDown = useCallback(
    (event) => {
      const combinedArray = [...calculatorButtons.flat(), ...additionalKeys]
      if (combinedArray.includes(event.key)) {
        handlingOperations(event?.key)
      }
    },
    [additionalKeys, calculatorButtons, handlingOperations],
  )

  you can consider it as below.

  const handleKeyDown = (event) => {
    const combinedArray = [...calculatorButtons.flat(), ...additionalKeys]
    if (combinedArray.includes(event.key)) {
      handlingOperations(event?.key)
    }
  };

  Hope you Got My Point.
*/
function App() {
  /**
   * This state is use for display value into the screen. Here initial value is empty. you will
   * know letter in this example why we take an array. instead of taking normal integer or string variable.
   * */
  const [operations, setOperations] = useState([])

  /**
   * calculatorButtons is use for the display the button actions.It's basically use of identify which value(expression) is clicked.
   *
   */
  const calculatorButtons = useMemo(
    () => [
      ['C', 'D', '%', '/'],
      ['7', '8', '9', '*'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['0', '.', '='],
    ],
    [],
  )
  /**
   * specialExpression is use for to check that 2 concurrent Arithmetic operator should not allowed.
   * You will See it's usage in preventConcurrentOperators function.
   */
  const specialExpression = useMemo(() => ['/', '*', '-', '+', '%'], [])

  /*
   * In this Example keyboard numpad event also handled so that's why additionalKeys
   * are defined. The purpose of this is that when we press enter from keyboard will got final result from calculator app.
   * simpler usage for Escape for clear All, and Delete for remove single single digit.
   */
  const additionalKeys = useMemo(() => ['Escape', 'Enter', 'Delete'], [])

  /*
   * This is a button click event handler. it is taking an one argument as buttonValue.
   * and called handlingOperations function.
   */
  const handleClick = (buttonValue) => {
    handlingOperations(buttonValue)
  }

  /***
   * This is function is used to produce the final result of expression with the help of eval() function of javascript.
   *  Once expression evaluated will again set it into operations as a final result.
   */
  const calculateExpressions = useCallback(() => {
    try {
      /**
       * As you know we have operations array. but eval() function take and string. so we need to convert array into string. so will
       * use join() method.
       */
      let result = operations?.join('')
      if (result) {
        result = eval(result)
        result = String(result)
        setOperations([result])
      }
    } catch (error) {
      console.log({ error })
    }
  }, [operations])

  /**
   * This function is basically use to prevent to add 2 concurrent arithmetic operator.
   * for example you have finalValue 5 and the you click on plus(+) now you have (5+) now if you again click on plus(+)
   * the plus(+) won added to current expression that's the use of this preventConcurrentOperators function.
   *
   */
  const preventConcurrentOperators = useCallback(
    (buttonValue) => {
      const lastElement = operations[operations.length - 1]
      const isOperator = specialExpression.includes(lastElement)
      if (!isOperator || !specialExpression.includes(buttonValue)) {
        return true
      }
    },
    [operations, specialExpression],
  )

  /***
   * handlingOperations function take an one argument which is value of button.
   * Here you can see SWITCH case is written. let's break down it.
   * case 'C': & case 'Escape': is basically use for clear all the result which is displayed and set to zero(0).
   * case '=': & case 'Enter':  is basically use for calculate an expression by calling calculateExpressions function.
   * case 'D': & case 'Delete': is basically use for Delete single single value for existing expression from at the end.
   *                            What is actually happening is that first spread entire array([..operations])
   *                            and then pop(read array pop method) last element from array (localOperations.pop()) and
   *                            again set it to operation State (setOperations(localOperations)).
   *
   * And default case: is basically pushed the value into operations array if first button clicked should not an arithmetic operator.
   * if operations array length is 2 the also check first condition and the check that 0th index value is zero(0) and 1st index value not (.) then only
   * button value set or else add newly clicked button to existing operations array.
   *
   */
  const handlingOperations = useCallback(
    (buttonValue) => {
      switch (buttonValue) {
        case 'C':
        case 'Escape':
          setOperations(['0'])
          break
        case '=':
        case 'Enter':
          calculateExpressions()
          break
        case 'D':
        case 'Delete':
          const localOperations = [...operations]
          localOperations.pop()
          setOperations(localOperations)
          break
        default:
          if (operations.length === 2) {
            if (preventConcurrentOperators(buttonValue)) {
              /**
               * This case needed because if your final output zero and click any button the prefix of current value is zero.
               * for example final result it 0 and you next click on 5 then it display '05' to handle this case below logic written.
               * instead of '05' it should be '5'.
               *  */
              if (operations[0] === '0' && operations[1] !== '.') {
                setOperations((prevState) => [buttonValue])
              } else {
                setOperations((prevState) => [...prevState, buttonValue])
              }
            }
          } else {
            if (
              operations.length !== 0 ||
              !specialExpression.includes(buttonValue)
            ) {
              if (preventConcurrentOperators(buttonValue)) {
                setOperations((prevState) => [...prevState, buttonValue])
              }
            }
          }
          break
      }
    },
    [
      calculateExpressions,
      operations,
      preventConcurrentOperators,
      specialExpression,
    ],
  )

  /***
   * This function only allowed calculatorButtons and additionalKeys from keyboard.
   */
  const handleKeyDown = useCallback(
    (event) => {
      const combinedArray = [...calculatorButtons.flat(), ...additionalKeys]
      if (combinedArray.includes(event.key)) {
        handlingOperations(event?.key)
      }
    },
    [additionalKeys, calculatorButtons, handlingOperations],
  )
  /**
   * Here is an keyboard event handler for numpad.
   * Any key pressed from keyboard handleKeyDown function will called.
   *
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="calculatorSection">
      <div className="calculatorWrapper w-100">
        <input
          type="text"
          value={operations?.join('')}
          className="inputClass"
          readOnly={true}
        />
        <br />
        <div className="buttonsWrapper">
          {calculatorButtons.flat().map((buttonItem, buttonIndex) => {
            let buttonClassName
            switch (buttonItem) {
              case 'C':
                buttonClassName = 'clearButton'
                break
              case '=':
                buttonClassName = 'equalButton'
                break
              case 'D':
                buttonClassName = 'deleteButton'
                break
              default:
                buttonClassName = 'commonButton'
                break
            }
            return (
              <button
                onClick={() => handleClick(buttonItem)}
                key={`button-${buttonIndex}`}
                className={buttonClassName}
                value={buttonItem}
                onKeyDown={handleKeyDown}
              >
                {buttonItem}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
