import { LoadingButton } from '@mui/lab';
import { Alert, Box, Fade, Grid, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";

import { useState } from "react";

import CryptoJS from "crypto-js"
import axios from "axios";

import Header from "../../components/Header";
import { Link, useNavigate } from 'react-router-dom';
import { EmailTextField } from '../../components/EmailTextField';
import { checkIfValidToken } from '../../utils/checkIfValidToken';

export function Register() {
    // Check if user token is still valid
    if (!checkIfValidToken()) return

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rewritePassword, setRewritePassword] = useState('')

    const [isRewritePasswordIncorrect, setIsRewritePasswordIncorrect] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isFailedRegistration, setIsFailedRegistration] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    function handleChangeRewritePassword(e: any) {
        setRewritePassword(e.target.value)

        if (password !== e.target.value) {
            setIsRewritePasswordIncorrect(true)
        } else {
            setIsRewritePasswordIncorrect(false)
        }
    }

    async function handleRegister() {
        setIsLoading(true)

        if (password !== rewritePassword) {
            setIsRewritePasswordIncorrect(true)
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setIsFailedRegistration(true)
            setErrorMessage('Password must be at least 8 characters long.')
            setIsLoading(false)
            return
        }

        try {
            const salt = CryptoJS.lib.WordArray.random(256).toString(CryptoJS.enc.Hex)

            const res = await axios.post('/api/register', {
                name: name,
                email: email,
                salt: salt,
                hash: CryptoJS.PBKDF2(password, salt, { keySize: 256, iterations: 1883 }).toString(CryptoJS.enc.Hex)
            })

            if (res.status === 200) {
                navigate('/login')
            }
        } catch (error: any) {
            console.error(error)

            setIsFailedRegistration(true)
            setTimeout(() => setIsFailedRegistration(false), 5000)

            setIsLoading(false)
            setErrorMessage(error.response.data || error.code)
        }

        setIsLoading(false)
    }

    return (
        <>
            <Header />

            <Grid
                container
                bgcolor={'primary.main'}
                display={'flex'}
                justifyContent={'center'}
                height={isMobile ? 'auto' : '40em'}
                sx={{
                    overflow: 'hidden',
                    boxShadow: 5,
                    borderRadius: 5,
                    mb: '2em'
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
                                Register
                            </Typography>
                        </Box>
                        <TextField 
                            required
                            label="Name"
                            color="secondary"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body1.fontSize,
                                    sm: theme.typography.body2.fontSize
                                },
                            })}
                        />
                        <EmailTextField
                            email={email}
                            setEmail={setEmail}
                        />
                        <TextField 
                            required
                            label="Password"
                            color="secondary"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body1.fontSize,
                                    sm: theme.typography.body2.fontSize
                                },
                            })}
                        />
                        <TextField 
                            required
                            error={isRewritePasswordIncorrect}
                            label={isRewritePasswordIncorrect ? 'Incorrect Input' : 'Rewrite Password'}
                            color="secondary"
                            fullWidth
                            type="password"
                            value={rewritePassword}
                            onChange={handleChangeRewritePassword}
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
                            fullWidth
                            onClick={handleRegister}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Continue
                        </LoadingButton>

                        <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                        >
                            Already have an account? 
                            <Link to={'/login'} style={{ marginLeft: '.25em', fontWeight: 'bold'}}>Login</Link>
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>


            <Box
                width={'100%'}
                display={'flex'}
                justifyContent={'center'}
            >
                <Fade in={isFailedRegistration}>
                    <Alert
                        onClose={() => setIsFailedRegistration(false)}
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