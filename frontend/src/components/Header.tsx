import { Grid, Typography, Tooltip, Box, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";

import { Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserDataContext";

function Header() {
    const { userData } = useContext(UserDataContext)
    let userName = userData?.name || ''

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleLogout() {
        axios.post('/api/logout')
        .then(() => {
            navigate('/login')
        })
        .catch((error) => {
            console.error(error)
        })
    }
    
    return (
        <Grid
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'flex-end'}
        >
            <Typography 
                variant={isMobile ? 'h3' : "h2"} 
                mt={isMobile ? '.5em' : '.75em'}
                mb={'.25em'}
                color={'secondary.main'}
                sx={{ fontWeight: 'bold' }}
            >
                CalPal
            </Typography>
            {userName === '' ? null :
                <>
                    <Tooltip 
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        title='Settings'
                        sx={{
                            fontSize: '1.5em',
                        }}
                        slotProps={{
                            popper: {
                                modifiers: [
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, -10],
                                        },
                                    }
                                ]
                            }
                        }}
                    >
                        <Box 
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            sx={{
                                cursor: 'pointer',
                                mb: '1.25em'
                            }}
                        >
                            <PersonIcon fontSize={isMobile ? 'medium' : "large"}/>
                            <Typography
                                variant={isMobile ? 'body2' : 'body1'}
                            >Hello, {userName}</Typography>
                        </Box>
                    </Tooltip>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => navigate('/userSettings')}>User Data</MenuItem>
                        <MenuItem onClick={() => navigate('/editFood')}>Foods/Dishes</MenuItem>
                        <MenuItem onClick={() => navigate('/changePassword')}>Change Password</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </>
            }
        </Grid>
    )
}

export default Header