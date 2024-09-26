import { Box, Typography } from "@mui/material";

export function Error() {
    
    return (
        <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100vh'}
        >
            <Typography variant={'h4'} color={'error'}> 
                {'An Internal Server Occured :('}
            </Typography>   
        </Box>
    )
}