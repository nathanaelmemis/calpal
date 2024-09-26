import { useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { Dispatch, SetStateAction, MouseEventHandler } from "react"

interface EditFoodDishDeleteAlertDialogProps {
    foodDishToDelete: string
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    handleDelete: MouseEventHandler<HTMLButtonElement>
}

export function EditFoodDishDeleteAlertDialog(props: EditFoodDishDeleteAlertDialogProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    p: '.5em 1.25em 1.25em .5em',
                    width: '350px'
                }
            }}
        >
            <DialogTitle>{`Delete food/dish ${props.foodDishToDelete}?`}</DialogTitle>   
            <DialogContent>
                <DialogContentText>
                    This action cannot be reversed. Deleted food will be removed from all dishes.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    color="secondary"
                    variant="contained"
                    onClick={() => props.setOpen(false)}
                    size={isMobile ? "small" : "medium"}
                >
                    Cancel
                </Button>
                <Button 
                    color="secondary"
                    variant="contained"
                    onClick={props.handleDelete}
                    size={isMobile ? "small" : "medium"}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}