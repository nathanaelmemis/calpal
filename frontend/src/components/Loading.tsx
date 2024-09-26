import { Box, Skeleton } from "@mui/material";

export function Loading() {
    return (
        <Box
            sx={{
                mt: {
                    xs: '.5em',
                    sm: '.75em'
                }
            }}
        >
            <Box
                width={'25%'}
                sx={{
                    mb: '.25em'
                }}
            >
                <Skeleton variant="text" animation="wave" height={120} />
            </Box>
            <Skeleton variant="rounded" animation="wave" height={150} sx={{ mb: { sm: '2em', xs: '1em'}}}/>
            <Skeleton variant="rounded" animation="wave" height={300} />
        </Box>
    )
}