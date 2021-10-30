import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom'
import logo from '../Images/logo.png'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
    tabs: {
	    marginLeft: '30px',
    },
    tab: {
        borderRadius: '8px',
	    color: '#693fd3',
        fontSize: '15px',
        fontWeight: 'bold',
        textDecoration: 'none',
        textTransform: 'none',
        '&.Mui-selected': {
            color: '#693fd3'
        }
    },
    indicator: {
        backgroundColor: '#693fd3',
    },
    logout: {
        color: '#693fd3',
        borderRadius: '8px',
        border: `1px solid #693fd3`,
        background: '#ffffff',
        fontWeight: 'bold',
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
 
  }));

const Header = (props) => {
    const classes = useStyles();
    const header = props.changeHeader;
    const [value, setValue] = useState(0);
    const service_url = process.env.REACT_APP_SERVICE_URL;


    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const logoutButtonClick = () => {
        localStorage.clear();
        window.location.assign(`${service_url}/auth/logout`);
    }

    
    const renderHomePageHeader = () => {
        return (
            <AppBar className={classes.customAppBar}>
                <Toolbar>
                    <div className={classes.logo}></div>
                    <Tabs value={value} onChange={handleChange} className={classes.tabs} classes={{ indicator: classes.indicator }} indicatorColor="secondary" textColor="primary" centered>
                        <Tab component={NavLink} exact={true} to="/" className={classes.tab} label="Get Started" />
                        <Tab component={NavLink} exact={true} to="/" className={classes.tab} label="How It Works" />
                        <Tab component={NavLink} exact={true} to="/" className={classes.tab} label="About Us" />
                        <Tab component={NavLink} exact={true} to="/" className={classes.tab} label="Contact" />
                    </Tabs>
                </Toolbar>
            </AppBar>
        ); 
    }

    const renderAdminHeader= () => {
        return (
            <AppBar className={classes.customAppBar}>
                <Toolbar>
                    <div className={classes.logo}></div>
                    <Tabs value={value} onChange={handleChange} className={classes.tabs} classes={{ indicator: classes.indicator }} indicatorColor="secondary" textColor="primary" centered>
                        <Tab component={NavLink} to="/games" className={classes.tab} label="Games" />
                        <Tab component={NavLink} to="/routes" className={classes.tab} label="Routes" />
                    </Tabs>
                    <Button className={classes.logout} variant="contained" onClick={logoutButtonClick} >LOGOUT</Button>
                </Toolbar>
            </AppBar>
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
export default Header;