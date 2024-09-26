import { LoadingButton } from "@mui/lab";
import { Grid, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

interface AddFoodDishButtonsProps {
    isLoading: boolean;
    handleAddFoodOrDish: MouseEventHandler<HTMLButtonElement>;
}

function AddFoodDishButtons({ isLoading, handleAddFoodOrDish }: AddFoodDishButtonsProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()
    
    return (
        <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'space-between'}
            mt={2}
        >
            <Box>
                <LoadingButton 
                    color="secondary"
                    variant="contained"
                    loading={isLoading}
                    size={isMobile ? 'small' : 'medium'}
                    onClick={() => navigate(`/createFood`)}
                >
                    {isMobile ? 'New Food' : 'Create New Food'}
                </LoadingButton>
            </Box>
            <Box>
                <Button
                    color="secondary"
                    variant="contained"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                        mr: '1em'
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    Cancel
                </Button>
                <LoadingButton
                    loading={isLoading}
                    color="secondary"
                    variant="contained"
                    size={isMobile ? 'small' : 'medium'}
                    onClick={handleAddFoodOrDish}
                >
                    Add
                </LoadingButton>
            </Box>
        </Grid>
    )
}

export default AddFoodDishButtons;