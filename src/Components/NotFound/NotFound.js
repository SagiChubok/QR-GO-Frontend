import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles( () => ({
  container: {
    position: 'relative',
    width: '90%',
    margin: '0px auto',
    top: '10%',
    marginBottom: 50,
    textAlign: 'center',
  },
  HomeButton: {
    backgroundColor: '#693fd3',
    color: '#ffffff',
    borderRadius: '8px',
    border: `1px solid #693fd3`,
    background: '#693fd3',
    textTransform: 'none',
    marginTop: 40
  }

  
  }));

const NotFound = () => {
    const classes = useStyles();
    
    return (
      <div className={classes.container}>
        <Typography variant="h1">404</Typography>
        <Typography variant="h4">OOPS, SORRY WE CAN'T FIND THAT PAGE!</Typography>
        <Typography variant="h6">Either something went wrong or the page doesn't exist anymore.</Typography>
        <Button component={Link} exact to="/" variant="contained" size="large" className={classes.HomeButton}>RETURN</Button>
      </div>      
    );
  }
  export default NotFound;