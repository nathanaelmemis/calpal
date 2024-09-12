import { LoadingButton } from '@mui/lab';
import { Alert, Box, Fade, Grid, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";

import { useEffect, useState } from "react";

import CryptoJS from "crypto-js"
import axios from "axios";

import Header from "../components/Header";
import { Link, useNavigate } from 'react-router-dom';
import { EmailTextField } from '../components/EmailTextField';

export function Login() {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [isFailedLogin, setIsFailedLogin] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await axios.post('/api/authenticate')
    
                if (res.status === 200) {
                    navigate('/dashboard')
                }
            } catch (error) {
                console.log(error)
            }
        }

        checkAuth()
    }, [])

    function handleOnChangeTextField(value: string, setFunction: Function) {
        setFunction(value)
        if (isFailedLogin) {
          setIsFailedLogin(false)
        }
    }

    async function handleLogin() {
        setIsLoading(true)
        if (isFailedLogin) {
            setIsFailedLogin(false)
        }

        try {
            const res = await axios.post('/api/login', {
                email: email,
                hash: CryptoJS.SHA256(email+password).toString(CryptoJS.enc.Hex)
            })

            if (res.status === 200) {
                navigate('/dashboard')
            }
        } catch (error: any) {
            console.error(error)
            setIsFailedLogin(true)
            setIsLoading(false)
            setErrorMessage(error.response.data.message || error.code)
        }

        setIsLoading(false)
    }

    return (
        <>
            <Header userName={''}/>

            <Grid
                container
                bgcolor={'primary.main'}
                display={'flex'}
                justifyContent={'center'}
                height={isMobile ? 'auto' : '40em'}
                sx={{
                    overflow: 'hidden',
                    boxShadow: 5,
                    borderRadius: 5
                }}
            >
                <Grid
                    item
                    xs={5}
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'block'
                        }
                    }}
                >
                    <img 
                        height={'100%'}
                        width={'100%'}
                        src={'fruits_and_vegetables.webp'} 
                        style={{
                            objectFit: 'cover',
                            borderRadius: '20px'
                        }}
                    />
                </Grid>
                <Grid
                    item
                    sm={7}
                    xs={12}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    p={isMobile ? '1em' : '5em'}
                >
                    <Stack
                        spacing={2}
                        width={'100%'}
                    >
                        <Box
                            width={'100%'}
                            display={'flex'}
                            sx={{
                                justifyContent: {
                                    xs: 'center',
                                    sm: 'flex-start'
                                }
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={'bold'}
                            >
                                Login
                            </Typography>
                        </Box>
                        <EmailTextField
                            email={email}
                            setEmail={setEmail}
                        />
                        <TextField 
                            label="Password"
                            color="secondary"
                            fullWidth
                            type="password"
                            value={password}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            onChange={(e) => handleOnChangeTextField(e.target.value, setPassword)}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body1.fontSize,
                                    sm: theme.typography.body2.fontSize
                                },
                            })}
                        />

                        <LoadingButton
                            color="secondary"
                            variant="contained"
                            loading={isLoading}
                            onClick={handleLogin}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Continue
                        </LoadingButton>

                        <Typography 
                            variant={isMobile ? 'body2' : 'body1'}
                        >
                            Don't have an account? 
                            <Link to={'/register'} style={{ marginLeft: '.25em', fontWeight: 'bold'}}>Register</Link>
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>


            <Box
                width={'100%'}
                display={'flex'}
                justifyContent={'center'}
            >
                <Fade in={isFailedLogin}>
                    <Alert
                    onClose={() => setIsFailedLogin(false)}
                    variant='filled'
                    severity="error"
                    sx={{ position: 'fixed', top: '10px' }}
                    >
                    {errorMessage}
                    </Alert>
                </Fade>
            </Box>
        </>
    )
}