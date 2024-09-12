import { LoadingButton } from "@mui/lab";
import { Grid, Button, useMediaQuery, useTheme } from "@mui/material";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

interface CreateFoodButtonsProps {
    isLoading: boolean,
    handleCreateButtonClick: MouseEventHandler<HTMLButtonElement>
}

function CreateFoodButtons({ isLoading, handleCreateButtonClick}: CreateFoodButtonsProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()
    
    return (
        <>
            {/* Buttons */}
            <Grid
                item
                xs={12}
                display={'flex'}
                justifyContent={'flex-end'}
                mt={isMobile ? '0' : '1em'}
                columnGap={2}
            >
            <Button
                color="secondary"
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
                onClick={() => navigate(-1)}
            >
                Cancel
            </Button>
            <LoadingButton
                color="secondary"
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
                onClick={handleCreateButtonClick}
                loading={isLoading}
            >
                Create
            </LoadingButton>
            </Grid>
        </>
    )
}

export default CreateFoodButtons;