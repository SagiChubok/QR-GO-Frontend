import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

import Game from './Game'

const useStyles = makeStyles( () => ({
  table: {
    height: 350,
    overflow: 'auto',
    marginBottom: 30,
  },
  tableTitle: {
    paddingTop: 15 ,
    paddingLeft: 15 ,
    color: '#693fd3',
    fontSize: '24px',
  }
  
  }));

const ActiveGames = (props) => {
  const classes = useStyles();
  const [activeGames, setActiveGames] = useState([]);
  const service_url = process.env.REACT_APP_SERVICE_URL;

  useEffect(() => { 
    fetchData();
  }, []);

  const fetchData = async () => {
    let data =[];
    try {
      data = await fetch(`${service_url}/api/games?state=Active`).then(res => res.json());
    } catch(err) {
      console.log("error where fetching data");
    }
    data.games.map(game => add({id: game._id, route: game.route, createdAt: moment(game.createdAt).format('YYYY/MM/DD'), gameTime: game.gameTime, groupsAmount: game.groupsAmount, gamePin: game.gamePin, state: game.state}))
  }

  const nextId = (activeGames = []) => {    
    let max = activeGames.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id , 0);
    return ++max;
  };

  const add = (newGame) => {
    setActiveGames(prevState => ([
        ...prevState, {
            id: newGame.id !== null ? newGame.id : nextId(prevState),
            route: newGame.route,
            createdAt: newGame.createdAt,
            gameTime: newGame.gameTime,
            groupsAmount: newGame.groupsAmount,
            gamePin: newGame.gamePin,
            state: newGame.state,
      }])
    )
  };

  const deleteGame = async (id) => {
    let result;
    try {
      result = await fetch(`${service_url}/api/games/${id}`, {method: 'DELETE'}).then(res => res.json());
    } catch(err) {
      console.log("error where fetching data");
    }
    console.log(result);

    setActiveGames(prevState => (
      prevState.filter((game, i) => game.id !== id)
    ))
  }


  const eachGame = (item, index) => {
  return  (<Game key={item.id} index={index} game={item}
              onClickDeleteBtn={deleteGame}>                
          </Game>)
  };
  
  return(  
      <TableContainer className={classes.table} component={Paper}>
        <Typography className={classes.tableTitle} gutterBottom>Active Games</Typography>
        <Table aria-label="customized table">
          <TableHead>
              <TableRow>
                  <TableCell style={{fontWeight: "bold"}} align="left">Date</TableCell>
                  <TableCell style={{fontWeight: "bold"}} align="left">Route</TableCell>
                  <TableCell style={{fontWeight: "bold"}} align="left">Players Per Group</TableCell>
                  <TableCell style={{fontWeight: "bold"}} align="left">Game Time</TableCell>
                  <TableCell style={{fontWeight: "bold"}} align="left">Game Status</TableCell>
                  <TableCell align="left"></TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            { activeGames.map(eachGame) }
          </TableBody>
        </Table>
      </TableContainer>  
  
  );   
  }
  export default ActiveGames;