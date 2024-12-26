import { TextField, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useRef, useState } from "react"

interface CalculatorTextFieldProps {
    label: string
    renderTrigger?: number
    initialValue: number
    setNumber: (newNumberValue: number) => void
}

/**
 * Requires own external state for initial value if initial value changes post-render.
 */
export function CalculatorTextField({ label, renderTrigger = 0, initialValue, setNumber }: CalculatorTextFieldProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const [stringValue, setStringValue] = useState('0')
    const [isError, setIsError] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [errorHelperText, setErrorHelperText] = useState('')
    const [helperText, setHelperText] = useState('')

    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        setStringValue(String(initialValue))
    }, [renderTrigger])

    function calculateString(stringValue: string): number {
        const stringArray = stringValue.match(/(?<!.)-\d+(\.\d+)?|\d+(\.\d+)?|\+|\-|\/|\*|[^0-9\+\-\/\\*]+/g) || []

        if (stringArray.length === 0) {
            setIsError(false)
            setStringValue('0')
            setHelperText('= 0')
            setNumber(0)
            return -1
        }

        if (stringArray.length === 1 && stringArray[0].length === 2 && stringArray[0][0] === '0') {
            setIsError(false)
            setStringValue(stringArray[0][1])
            setHelperText(`= ${stringArray[0][1]}`)
            setNumber(Number(stringArray[0][1]))
            return -1
        }
 
        if (stringArray.length % 2 === 0) {
            setIsError(true)
            setErrorHelperText('Invalid Equation')
            return 0
        }

        for (let i = 0; i < stringArray.length; i++) {
            if (i % 2 === 0) {
                if (isNaN(Number(stringArray[i]))) {
                    setIsError(true)
                    setErrorHelperText('Invalid Equation')
                    return 0
                }
            } else {
                if (!stringArray[i].match(/\+|\-|\/|\*/g)) {
                    setIsError(true)
                    setErrorHelperText('Invalid Equation')
                    return 0
                }
            }
        }

        let totalValue = Number(stringArray[0])

        stringArray.forEach((element: string, index: number) => {
            if (index % 2 !== 0) {
                // odd index should be an operator
                if (element === '+') {
                    totalValue += Number(stringArray[index + 1])
                } else if (element === '-') {
                    totalValue -= Number(stringArray[index + 1])
                } else if (element === '*') {
                    totalValue *= Number(stringArray[index + 1])
                } else if (element === '/') {
                    totalValue /= Number(stringArray[index + 1])
                }
            }
        })

        if (totalValue === Infinity || isNaN(totalValue) || totalValue < 0) {
            setErrorHelperText('Invalid Value')
            setIsError(true)
            return 0
        }

        setIsError(false)
        return Number(totalValue)
    }

    function handleChange(newStringValue: string) {
        clearTimeout(timeoutRef.current)
        const calculatedValue = calculateString(newStringValue)
        if (calculatedValue !== -1) {
            setNumber(calculatedValue)
            setHelperText(`= ${String(calculatedValue)}`)
            setStringValue(newStringValue)
        }
    }

    function handleBlur() {
        setHelperText('')
        setStringValue(String(calculateString(stringValue)))
        setIsValid(true)
        timeoutRef.current = setTimeout(() => {
            setIsValid(false)
        }, 500)
    }

    return (
        <TextField
            fullWidth
            error={isError}
            helperText={helperText}
            label={isError ? errorHelperText : label}
            color={isValid ? "success" : "secondary"}
            value={stringValue}
            size={isMobile ? "small" : "medium"}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setHelperText('= 0')}
            onBlur={() => handleBlur()}
            sx={(theme) => ({
                '& fieldset': {
                    borderColor: isValid ? 'green' : 'rgba(0, 0, 0, 0.23)'
                },
                '& label': {
                    color: isValid ? 'green' : isError? 'red' : 'rgba(0, 0, 0, 0.6)'
                },
                '& input': {
                    fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize
                }
            })}
        />
    )
}