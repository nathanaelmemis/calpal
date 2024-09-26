import { useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"

interface DeleteAlertDialogProps {
    foodDishEatenToDelete: string,
    open: boolean,
    setOpen: (newValue: boolean) => void,
    handleDelete: () => void
}

export function DeleteAlertDialog(props: DeleteAlertDialogProps) {
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
            <DialogTitle>{`Delete food/dish eaten ${props.foodDishEatenToDelete}?`}</DialogTitle>   
            <DialogContent>
                <DialogContentText>
                    This action cannot be reversed.
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