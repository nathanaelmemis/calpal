import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"

import { 
    ArrowDropDown as ArrowDropDownIcon, 
    ArrowDropUp as ArrowDropUpIcon, 
} from "@mui/icons-material";

interface NavigateButtonCardProps {
    text: string
    route: string
    arrowIconDirection: 'up' | 'down'
}

export function NavigateButtonCard({
        text,
        route,
        arrowIconDirection
    }: NavigateButtonCardProps) 
{
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    return (
        <Grid
            bgcolor={'secondary.dark'}
            p={isMobile ? '.5em' : '1em'}
            display={'flex'}
            justifyContent={'center'}
            mb={isMobile ? '1.25em' : '2em'}
            sx={{
                boxShadow: 5,
                borderRadius: 5,
                cursor: 'pointer'
            }}
            onClick={() => navigate(route)}
        >
            {
                arrowIconDirection === 'up' ? <ArrowDropUpIcon color="primary" /> : <ArrowDropDownIcon color="primary" />
            }
            <Typography
                color={'primary.main'}
                fontWeight={isMobile ? 'normal' : 'bold'}
                mx={'.5em'}
            >
                {text}
            </Typography>
            {
                arrowIconDirection === 'up' ? <ArrowDropUpIcon color="primary" /> : <ArrowDropDownIcon color="primary" />
            }
        </Grid>
    )
}