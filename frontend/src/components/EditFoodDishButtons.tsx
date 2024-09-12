import { LoadingButton } from "@mui/lab";
import { Grid, Button } from "@mui/material";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

interface EditFoodDishButtonsProps {
    isLoading: boolean;
    handleUpdate: MouseEventHandler<HTMLButtonElement>;
}

function EditFoodDishButtons(props: EditFoodDishButtonsProps) {
    const navigate = useNavigate()
    
    return (
        <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent={'flex-end'}
            mt={'1em'}
        >
            <Button
                color="error"
                variant="contained"
                sx={{
                    mr: 2
                }}
                onClick={() => navigate('/dashboard')}
            >
                Cancel
            </Button>
            <LoadingButton
                loading={props.isLoading}
                color="secondary"
                variant="contained"
                onClick={props.handleUpdate}
            >
                Save
            </LoadingButton>
        </Grid>
    )
}

export default EditFoodDishButtons;