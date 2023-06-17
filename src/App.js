import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
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
  const specialExpression = useMemo(() => ['/', '*', '-', '+', '%'], [])
  const additionalKeys = useMemo(() => ['Escape', 'Enter', 'Delete'], [])
  const [operations, setOperations] = useState([])
  const handleClick = (buttonValue) => {
    handlingOperations(buttonValue)
  }
  const calculateExpressions = useCallback(() => {
    try {
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
  const handlingOperations = useCallback(
    (buttonValue) => {
      switch (buttonValue) {
        case 'C':
        case 'Escape':
          setOperations([])
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

  const handleKeyDown = useCallback(
    (event) => {
      const combinedArray = [...calculatorButtons.flat(), ...additionalKeys]
      if (combinedArray.includes(event.key)) {
        handlingOperations(event?.key)
      }
    },
    [additionalKeys, calculatorButtons, handlingOperations],
  )

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
