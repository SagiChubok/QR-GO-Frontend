import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom'
import logo from '../Images/logo.png'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';

import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations'

const bounceInAnimation = keyframes`${bounceIn}`;
const BounceInDiv = styled.div`
  animation: 3s ${bounceInAnimation};
`;

const useStyles = makeStyles( (theme) => ({
    logo: {
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '50px',
        height: '50px',
        marginLeft: '10px',
    },
    customAppBar: {
        backgroundColor: '#ffffff',
    },
    logout: {
        color: '#693fd3',
        borderRadius: '8px',
        border: `1px solid #693fd3`,
        background: '#ffffff',
        fontWeight: 'bold',
        position: 'absolute',
        right: '10px',
        top: '12px'
    },
    menu: {
        position: 'absolute',
        right: '20px',
        top: '12px'
    },
    bigLogo: {
        backgroundImage:`url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '120px',
        height: '120px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px'
      },
      drawer: {
        width: '200px',
      },
      menuButton: {
        fontSize: '30px',
	    color: '#693fd3',
      },
      menuItem: {
	    color: '#693fd3',
        fontSize: '15px',
        fontWeight: 'bold',
        textDecoration: 'none',
        textTransform: 'none',
      }
  }));

const HeaderMobile = (props) => {
    const classes = useStyles();
    const header = props.changeHeader;
    const service_url = process.env.REACT_APP_SERVICE_URL;

    const logoutButtonClick = () => {
        localStorage.clear();
        window.location.assign(`${service_url}/auth/logout`);
    }
    const [state, setState] = useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setState({ ...state, [anchor]: open });
    };

    const renderHomePageHeader = () => {
        return (
            <>
            <AppBar className={classes.customAppBar}>
                <Toolbar>
                    <div className={classes.logo}></div>
                    <div onClick={toggleDrawer('right', true)} className={classes.menu} variant="contained"><MenuIcon className={classes.menuButton}/></div>
                </Toolbar>
            </AppBar>
            <Drawer PaperProps={{ className: classes.drawer }}  anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                <MenuItem component={NavLink} exact={true} to="/" className={classes.menuItem} >Get Started</MenuItem>
                <MenuItem component={NavLink} exact={true} to="/" className={classes.menuItem} >How It Works</MenuItem>
                <MenuItem component={NavLink} exact={true} to="/" className={classes.menuItem} >About Us</MenuItem>
                <MenuItem component={NavLink} exact={true} to="/" className={classes.menuItem} >Contact</MenuItem>
            </Drawer>
            </>
        ); 
    }

    const renderAdminHeader= () => {
        return (
            <>
            <AppBar className={classes.customAppBar}>
                <Toolbar>
                    <div className={classes.logo}></div>
                    <div onClick={toggleDrawer('right', true)} className={classes.menu} variant="contained"><MenuIcon className={classes.menuButton}/></div>
                </Toolbar>
            </AppBar>    
            <Drawer PaperProps={{ className: classes.drawer }} anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                <MenuItem component={NavLink} to="/games" className={classes.menuItem} >Games</MenuItem>
                <MenuItem component={NavLink} to="/routes" className={classes.menuItem} >Routes</MenuItem>
                <MenuItem variant="contained" onClick={logoutButtonClick} className={classes.menuItem}>LOGOUT</MenuItem>
            </Drawer>
            </>
        ); 
    }    
    const renderLogoutOnlyHeader= () => {
        return (
            <Toolbar>
                <BounceInDiv className={classes.bigLogo}></BounceInDiv>
                <Button className={classes.logout} variant="contained" onClick={logoutButtonClick} >LOGOUT</Button>
            </Toolbar>
        ); 
    }
    const renderNotFoundHeader= () => {
        return (
            <Toolbar>
            </Toolbar>
        ); 
    }

    return header === "HomePageHeader" ? renderHomePageHeader() : (header === "AdminHeader" ? renderAdminHeader() : (header === "LogoutOnlyHeader" ? renderLogoutOnlyHeader() : renderNotFoundHeader()));
}
export default HeaderMobile;