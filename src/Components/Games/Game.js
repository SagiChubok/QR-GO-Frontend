import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import BarChartIcon from '@material-ui/icons/BarChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Link } from 'react-router-dom'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const useStyles = makeStyles( () => ({
  gameButton: {
    backgroundColor: '#693fd3',
    color: 'white',
    marginLeft: 10,
  },
  singleButton: {
    paddingRight: 116,
  },
  withoutButton: {
    paddingRight: 166,
  }
}));

const Game = (props) => {
    const classes = useStyles();

    const gameStatus = props.game.state;

    const deleteBtn = () => {
      props.onClickDeleteBtn(props.game.id);
    };

    const pregame = () => {
      return (
        <StyledTableRow key={props.game.id}>
            <StyledTableCell component="th" scope="row">{props.game.createdAt}</StyledTableCell>
            <StyledTableCell align="left"> {props.game.route.routeName} </StyledTableCell>
            <StyledTableCell align="left"> {props.game.groupsAmount} </StyledTableCell>
            <StyledTableCell align="left"> {`${props.game.gameTime.hours}h ${props.game.gameTime.minutes}m`} </StyledTableCell>
            <StyledTableCell align="left"> {props.game.state} </StyledTableCell>
            <StyledTableCell align="left"> 
              <Link to={`/lobby?id=${props.game.id}`} target="_blank">
                <IconButton className={classes.gameButton} size="small">
                  <PlayArrowIcon />
                </IconButton>
              </Link>
              <Link to={`/game?id=${props.game.id}`}>
                <IconButton className={classes.gameButton} size="small">
                    <SettingsIcon />
                </IconButton>
              </Link>
              <IconButton className={classes.gameButton} onClick={deleteBtn} size="small">
                  <DeleteIcon />
              </IconButton>
            </StyledTableCell>
        </StyledTableRow>
      );
    }
    const endgame = () => {
      return (
        <StyledTableRow key={props.game.id}>
            <StyledTableCell component="th" scope="row">{props.game.createdAt}</StyledTableCell>
            <StyledTableCell align="left"> {props.game.route.routeName} </StyledTableCell>
            <StyledTableCell align="left"> {props.game.groupsAmount} </StyledTableCell>
            <StyledTableCell align="left"> {`${props.game.gameTime.hours}h ${props.game.gameTime.minutes}m`} </StyledTableCell>
            <StyledTableCell align="left"> {props.game.state} </StyledTableCell>
            <StyledTableCell className={classes.singleButton} align="left">
              <Link to={`/statistics?id=${props.game.id}`}>
                <IconButton className={classes.gameButton} size="small">
                  <BarChartIcon />
                </IconButton>
              </Link>
            </StyledTableCell>
        </StyledTableRow>
      );
    }
    const ingame = () => {
      return (
        <StyledTableRow key={props.game.id}>
            <StyledTableCell component="th" scope="row">{props.game.createdAt}</StyledTableCell>
            <StyledTableCell align="left"> {props.game.route.routeName} </StyledTableCell>
            <StyledTableCell align="left"> {props.game.groupsAmount} </StyledTableCell>
            <StyledTableCell align="left"> {`${props.game.gameTime.hours}h ${props.game.gameTime.minutes}m`} </StyledTableCell>
            <StyledTableCell align="left"> {props.game.state} </StyledTableCell>
            <StyledTableCell className={classes.withoutButton} align="left"></StyledTableCell>
        </StyledTableRow>
      );
    }

    return gameStatus === "Pregame" ? pregame() : (gameStatus === "Endgame" ? endgame() : ingame());
    
  }
  export default Game;