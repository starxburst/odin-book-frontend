import React, { useState, useContext } from 'react';
import UserContext from "../UserContext";
import { Link } from "react-router-dom";
import { Drawer, Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import friendsLogo from "../assets/icon/friends.png";
import searchLogo from "../assets/icon/search.png";
import settingLogo from "../assets/icon/setting.png";
import loginLogo from "../assets/icon/login.png";
import logoutLogo from "../assets/icon/logout.png";
import '../style/MuiDrawer.css';


const MuiDrawer = ({logout}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);

    
    return (
        <>
            <IconButton size='large' edge='start' color='inherit' aria-label='logo' onClick={() => setIsDrawerOpen(true)}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor='left' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
                sx: {
                    backgroundColor: "#18191a",
                    }
            }}>
                {user?
                <Box p={2} width='250px' textAlign='center' role='presentation' sx={{bgcolor: '#202122', color: 'white'}}>
                    <Link to={`/profile/${user._id}`} className="link MuiDrawerItemLinkContainer" onClick={() => setIsDrawerOpen(false)}>
                        <img src={settingLogo} alt="" className="controlBoardLogo"/>
                        <div className="MuiDrawerItemName">Account</div>
                    </Link>
                    <hr className='drawer-hr'></hr>
                    <Link to={`/friends`} className="link MuiDrawerItemLinkContainer" onClick={() => setIsDrawerOpen(false)}>
                        <img src={friendsLogo} alt="" className="controlBoardLogo"/>
                        <div className="MuiDrawerItemName">Friends</div>
                    </Link>
                    <hr className='drawer-hr'></hr>
                    <Link to={`/search`} className="link MuiDrawerItemLinkContainer" onClick={() => setIsDrawerOpen(false)}>
                        <img src={searchLogo} alt="" className="controlBoardLogo"/>
                        <div className="MuiDrawerItemName">Search</div>
                    </Link>
                    <hr className='drawer-hr'></hr>
                    <div className="MuiDrawerItemDivContainer" onClick={() => {
                        logout();
                        setIsDrawerOpen(false);
                        }}>
                        <img src={logoutLogo} alt="" className="controlBoardLogo"/>
                        <div className="MuiDrawerItemName">Logout</div>
                    </div>
                </Box>
                :
                <div>
                    <Box p={2} width='250px' textAlign='center' role='presentation' sx={{bgcolor: '#202122', color: 'white'}}>
                        <Link to={`/login`} className="link MuiDrawerItemLinkContainer" onClick={() => setIsDrawerOpen(false)}>
                            <img src={loginLogo} alt="" className="controlBoardLogo"/>
                            <div className="MuiDrawerItemName">Plase Login first</div>
                        </Link>
                    </Box>
                </div>
                }
            </Drawer>
        </>
    )

}

export default MuiDrawer;