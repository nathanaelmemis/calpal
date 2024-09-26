import { Box, Button, Grid, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import Header from "../../components/Header"
import { useContext, useState } from "react"
import { LoadingButton } from "@mui/lab"
import { useNavigate } from "react-router-dom"
import CryptoJS from "crypto-js"
import axios from "axios"
import { EmailTextField } from "../../components/EmailTextField"
import { checkAuth } from "../../utils/checkAuth"
import { UserDataContext } from "../../context/UserDataContext"
import { Loading } from "../../components/Loading"

export function ChangePassword() {
    // Check if user is authenticated
    if (!checkAuth()) return
    
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const {
        isFetchingData
    } = useContext(UserDataContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reEnterNewPassword, setReEnterNewPassword] = useState('')

    const [isRewritePasswordIncorrect, setIsRewritePasswordIncorrect] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false)

    function handleChangeRewritePassword(newValue: string) {
        setReEnterNewPassword(newValue)

        if (newPassword !== newValue) {
            setIsRewritePasswordIncorrect(true)
        } else {
            setIsRewritePasswordIncorrect(false)
        }
    }

    function handleChangePassword(newValue: string) {
        setIsInvalidCredentials(false)

        setPassword(newValue)
    }

    function handleConfirm() {
        setIsLoading(true)

        if (isRewritePasswordIncorrect) {
            setIsLoading(false)
            return
        }

        axios.post('/api/changePassword', {
            email: email,
            hash: CryptoJS.SHA256(email+password).toString(CryptoJS.enc.Hex),
            newHash: CryptoJS.SHA256(email+newPassword).toString(CryptoJS.enc.Hex),
        })
        .then(() => {
            navigate('/login')
        })
        .catch((error) => {
            if (error.response.status === 400) {
                setIsInvalidCredentials(true)
            }
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    return (
        isFetchingData ? <Loading /> :
        <>
            <Header />

            <Grid
                container
                bgcolor={'primary.main'}
                p={'1em'}
                gap={2}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5
                }}
            >
                {/* Title */}
                <Grid
                    item
                    xs={12}
                    display={'flex'}
                    justifyContent={'center'}
                >
                    <Typography 
                        variant={isMobile ? 'h5' : "h4"}
                        fontWeight={'bold'}
                        color={'secondary.main'}
                    >
                        Change Password
                    </Typography>
                </Grid>

                {/* Passwords Text Fields */}
                <Stack
                    width={'100%'}
                    spacing={2}
                >
                    <EmailTextField
                        email={email}
                        setEmail={setEmail}
                        error={isInvalidCredentials}
                    />
                    <TextField 
                        error={isInvalidCredentials}
                        color="secondary"
                        label={isInvalidCredentials ? 'Invalid Password' : 'Old Password'}
                        value={password}
                        fullWidth
                        type="password"
                        onChange={(e) => handleChangePassword(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize
                        })}
                    />
                    <TextField 
                        color="secondary"
                        label={'New Password'}
                        value={newPassword}
                        fullWidth
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize
                        })}
                    />
                    <TextField 
                        error={isRewritePasswordIncorrect}
                        color="secondary"
                        label={isRewritePasswordIncorrect ? 'Incorrect Input' : 'Re-enter New Password'}
                        value={reEnterNewPassword}
                        fullWidth
                        type="password"
                        onChange={(e) => handleChangeRewritePassword(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize
                        })}
                    />
                    <Box
                        display={'flex'}
                        justifyContent={'flex-end'}
                    >
                        <Button
                            color="secondary"
                            variant='contained'
                            sx={{mr: '1em'}}
                            onClick={() => navigate('/dashbaord')}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            color="secondary"
                            variant='contained'
                            loading={isLoading}
                            onClick={handleConfirm}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Confirm
                        </LoadingButton>
                    </Box>
                </Stack>
            </Grid>
        </>
    )
}