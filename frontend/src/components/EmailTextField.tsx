import { TextField, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

interface EmailTextFieldProps {
    email: string
    setEmail: Function
    error?: boolean
}

export function EmailTextField({ email, setEmail, error = false }: EmailTextFieldProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const [isInvalidEmail, setIsInvalidEmail] = useState(false)
    
    function handleChangeEmail(newValue: string) {
        if (!newValue.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            setIsInvalidEmail(true)
        } else {
            setIsInvalidEmail(false)
        }

        setEmail(newValue)
    }

    return (
        <TextField
            label={isInvalidEmail || error ? 'Invalid Email' : "Email"}
            type="email"
            variant="outlined"
            color="secondary"
            fullWidth
            required
            value={email}
            error={isInvalidEmail || error }
            onChange={(e) => handleChangeEmail(e.target.value)}
            size={isMobile ? 'small' : 'medium'}
            sx={(theme) => ({
                fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize
            })}
        />
    )
}