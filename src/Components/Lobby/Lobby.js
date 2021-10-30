import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import queryString from 'query-string'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import styled, { keyframes } from 'styled-components';
import { fadeIn, bounceIn } from 'react-animations'
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


let socket;

const fadeInAnimation = keyframes`${fadeIn}`;
const FadeInDiv = styled.div`
  animation: 3s ${fadeInAnimation};
`;

const bounceInAnimation = keyframes`${bounceIn}`;
const BounceInDiv = styled.div`
  animation: 3s ${bounceInAnimation};
`;

const useStyles = makeStyles( (theme) => ({
    wrapper: {
    width: '90%',
    margin: '0px auto',
  },
  lobbyContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamePinContainer: {
    position: 'relative',
    top: '10px',
    marginRight: '1%',
  },
  textGamePin: {
    width: '160px',
    height: '40px',
    backgroundColor: 'white',
    textAlign: 'center',
    lineHeight: '40px',
    margin: '0px auto',
    borderRadius: '10px 10px 0px 0px',
    fontWeight: 1000,
    fontSize: '25px',
  },
  gamePin: {
    width: '250px',
    height: '80px',
    backgroundColor: 'white',
    borderRadius: '10px',
    textAlign: 'center',
    lineHeight: '80px',
    fontWeight: 1000,
    fontSize: '60px',
    color: '#693fd3',
    letterSpacing: '3px',
  },
  playersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    minHeight: '200px',
    marginTop: '10px',
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: '20px',
  },
  startButton: {
    color: '#ffffff',
    borderRadius: '8px',
    marginTop: '35px',
    border: `1px solid #693fd3`,
    background: '#693fd3',
    fontSize: '20px',
    textTransform: 'none',
    fontWeight: 1000,
  },
  playersCountContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: '40px',
  },
  personIcon: {
    fontSize: '36px',
    color: '#693fd3',
  },
  playersCount: {
    fontSize: '25px',
    fontWeight: 600,
  }
  }));

const Lobby = (props) => {
    const [game, setGame] = useState({id: "", route: "", createdAt: "", gameTimeHours: "",  gameTimeMinutes: "", groupsAmount: "", gamePin: "", state: ""});
    const [players, setPlayers] = useState([]);
    const [playersCount, setPlayersCount] = useState(0);

    const [title, setTitle] = useState("Uh-oh! Something went wrong");
    const [error, setError] = useState("Unfortunately, QR GO has stopped working because of an unexpected error. We're sorry for the inconvenience!");
    const [open, setOpen] = useState(false);
    const service_url = process.env.REACT_APP_SERVICE_URL;

    useEffect(() => { 
        getSpecificGame();

        socket = io(service_url);
      
        return () => {
          socket.emit('disconnect');
          socket.off();
        }
    }, []);

    useEffect(() => {
      socket.on("lobbyData", ({ players }) => {
        setPlayers(players);
        setPlayersCount(players.length)
      });
    }, []);

    const getSpecificGame = async () => {
        const value = queryString.parse(props.location.search);
        const gameId = value.id;
        if (gameId) {
            let data =[];
            try {
            data = await fetch(`${service_url}/api/games/${gameId}`).then(res => res.json());

            setGame({id: data.game._id, route: data.game.route, createdAt: data.game.createdAt, gameTimeHours: data.game.gameTime.hours, gameTimeMinutes: data.game.gameTime.minutes, groupsAmount: data.game.groupsAmount, gamePin: data.game.gamePin, state: data.game.state});      
            
            socket.emit('adminJoinLobby', { room: gameId }, (error) => {
              if (error) {
                setError(error);
                setOpen(true);
              }
            });    

            } catch(err) {
              setOpen(true);
            }

        } else setOpen(true);
    }

    const eachAvatar = (item, index) => {
        return  (<FadeInDiv>
          <Tooltip title={item.name} arrow>
          <Avatar key={item.id} index={index} alt="" src={item.image} className={classes.avatar} />
          </Tooltip>
          </FadeInDiv>)
    };

    const handleStartGame = (e) => {
      e.preventDefault();

      socket.emit('startGame', { room: game.id }, (error) => {
        if (error) {
          if(error === 'Start')
          {
            setTitle("Game Started");
            setError("The game is running at the moment, please stay alert and available in case of an emergency");
            setOpen(true);
          }
          else
            alert(error)
        }
      });    
    }

    const classes = useStyles();

    const lobby = () => {
      return (
        <div className={classes.wrapper}>
          <div className={classes.lobbyContainer}>
            <div className={classes.gamePinContainer}>
              <BounceInDiv>
                <Typography  className={classes.textGamePin}>Game PIN:</Typography>
                <Typography className={classes.gamePin}>{game.gamePin}</Typography>
              </BounceInDiv>
            </div>
            <div className={classes.playersCountContainer}>
              <PersonIcon className={classes.personIcon}/>
              <Typography className={classes.playersCount}>{playersCount}</Typography>
            </div>
            <div className={classes.playersContainer}>
                { players.map(eachAvatar) }
            </div>
            <Button className={classes.startButton} onClick={handleStartGame} variant="contained">Start Game!</Button>
          </div>
        </div>    
      );
    }

    const errorLobby = () => {
      return (
        <>
         <Dialog
         open={open}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description">
         <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">
             {error}
           </DialogContentText>
         </DialogContent>
       </Dialog>   
       </> 
      );
    }

    return open ? errorLobby() : lobby();
  }
  export default Lobby;