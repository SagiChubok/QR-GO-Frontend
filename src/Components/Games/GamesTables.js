import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActiveGames from './ActiveGames'
import PastGames from './PastGames'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const useStyles = makeStyles( () => ({
  tablesContainer: {
    position: 'relative',
    width: '90%',
    minHeight: '850px',
    margin: '0px auto',
    top: '15%',
    marginBottom: 50,
  },
  createButton: {
    color: '#ffffff',
    borderRadius: '8px',
    border: `1px solid #693fd3`,
    background: '#693fd3',
    textTransform: 'none',
    textDecoration: 'none',
    marginBottom: 30,
  }
}));

const GamesTables = () => {
    const classes = useStyles();
    
    useEffect(() => { 
      window.scrollTo(0, 0);
    }, []);

    return (
      <div className={classes.tablesContainer}>
        <Button component={Link} to="/game" variant="contained" size="large" className={classes.createButton}>Create a New Game</Button>
        <ActiveGames/>
        <PastGames/>
      </div>     
    );
  }
  export default GamesTables;