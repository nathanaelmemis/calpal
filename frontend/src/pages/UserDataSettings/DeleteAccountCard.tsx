import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { EmailTextField } from "../../components/EmailTextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import CryptoJS from "crypto-js";

interface DeleteAccountCardProps {
    isLoading: boolean
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export function DeleteAccountCard({
    isLoading,
    setIsLoading
}: DeleteAccountCardProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

    const [open, setOpen] = useState(false);

    return (
        <Grid
            container
            bgcolor={'primary.main'}
            p={'1em'}
            gap={2}
            mb={isMobile ? '1.25em' : '2em'}
            sx={{
                boxShadow: 5,
                borderRadius: 5
            }}
        >
            <Stack
                display={'flex'}
                alignItems={'center'}
                direction={'column'}
                width={'100%'}
                spacing={2}
            >
                <Typography 
                    variant={isMobile ? 'h5' : "h4"}
                    fontWeight={'bold'}
                    color={'error.main'}
                >
                    Danger Zone
                </Typography>
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    color="error"
                    onClick={() => setOpen(true)}
                    size={isMobile ? 'small' : 'medium'}
                >
                    Delete Account
                </LoadingButton>
            </Stack>

            <EditFoodDishDeleteAlertDialog 
                open={open}
                setOpen={setOpen}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </Grid>
    )
}

interface EditFoodDishDeleteAlertDialogProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    isLoading: boolean
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export function EditFoodDishDeleteAlertDialog({
    open,
    setOpen,
    isLoading,
    setIsLoading
}: EditFoodDishDeleteAlertDialogProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

    async function handleDelete() {
        setIsLoading(true)

        try {
            const getSaltRes = await axios.get('/api/getSalt', {
                params: {
                    email: email
                }
            })

            await axios.delete('/api/deleteAccount', {
                data: {
                    email: email,
                    hash: CryptoJS.PBKDF2(password, getSaltRes.data.salt, { keySize: 256, iterations: 1883 }).toString(CryptoJS.enc.Hex),
                }
            })

            await axios.post('/api/logout')

            navigate('/login')
            setOpen(false)
        } catch (error: any) {
            console.error(error)
            if (error.response.status === 404) {
                setIsInvalidCredentials(true)
            }
        }

        setIsLoading(false)
    }

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    p: '.5em 1.25em 1.25em .5em',
                    width: '380px'
                }
            }}
        >
            <DialogTitle color={'error.main'}>Are you sure to delete this account?</DialogTitle>   
            <DialogContent>
                <Stack
                    spacing={2}
                    mb={2}
                >
                    <DialogContentText color={'error.main'}>
                        This action is irreversible. All data associated with this account will be lost.
                    </DialogContentText>
                    <EmailTextField
                        email={email}
                        setEmail={setEmail}
                        error={isInvalidCredentials}
                        variant="standard"
                    />
                    <TextField 
                        variant="standard"
                        required
                        error={isInvalidCredentials}
                        color="secondary"
                        label={isInvalidCredentials ? 'Invalid Password' : 'Password'}
                        value={password}
                        fullWidth
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize
                        })}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button 
                    color="secondary"
                    variant="contained"
                    onClick={() => setOpen(false)}
                    size={isMobile ? "small" : "medium"}
                >
                    Cancel
                </Button>
                <LoadingButton 
                    loading={isLoading}
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                    size={isMobile ? "small" : "medium"}
                >
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}