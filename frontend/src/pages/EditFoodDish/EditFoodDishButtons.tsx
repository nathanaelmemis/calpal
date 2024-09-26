import { LoadingButton } from "@mui/lab";
import { Grid, Button, useMediaQuery, useTheme, Box } from "@mui/material";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

interface EditFoodDishButtonsProps {
    isLoading: boolean
    disabled: boolean
    handleUpdate: MouseEventHandler<HTMLButtonElement>
    setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function EditFoodDishButtons({
    isLoading,
    disabled,
    handleUpdate,
    setIsDeleteDialogOpen
}: EditFoodDishButtonsProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()
    
    return (
        <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'space-between'}
        >
            <LoadingButton
                disabled={disabled}
                loading={isLoading}
                color="error"
                variant="contained"
                onClick={() => setIsDeleteDialogOpen(true)}
                size={isMobile ? "small" : "medium"}
            >
                Delete
            </LoadingButton>
            <Box
                display={'flex'}
                justifyContent={'flex-end'}
            >
                <Button
                    color="secondary"
                    variant="contained"
                    sx={{
                        mr: 2
                    }}
                    onClick={() => navigate('/dashboard')}
                    size={isMobile ? "small" : "medium"}
                >
                    Cancel
                </Button>
                <LoadingButton
                    disabled={disabled}
                    loading={isLoading}
                    color="secondary"
                    variant="contained"
                    onClick={handleUpdate}
                    size={isMobile ? "small" : "medium"}
                >
                    Save
                </LoadingButton>
            </Box>
        </Grid>
    )
}