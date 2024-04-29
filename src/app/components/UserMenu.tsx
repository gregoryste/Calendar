import { Avatar, Box, Button, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { authContext } from "../authContext";

const useStyles = makeStyles({
    userDetails: {
        borderBottom: "1px solid rgb(244, 244, 244)",
        marginBottom: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
            marginBottom: "8px" 
        }
    }
})

export function UserMenu(){
    const { user, signOut } = useContext(authContext);

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
    <>
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            Dashboard
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <Box className={classes.userDetails}>
                <Avatar >
                    <Icon>person</Icon>
                </Avatar>
     
                <div>{user.name}</div>
                <small>{user.email}</small>
            </Box>
            <MenuItem onClick={signOut}>Logout</MenuItem>
        </Menu>
        
         <IconButton>
            <Avatar>
                <Icon>person</Icon>
            </Avatar>
        </IconButton>
    </>
    )
}