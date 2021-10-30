import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ribbon from '../../Images/ribbon.svg'
import trophy from '../../Images/trophy.svg'
import MobileStepper from '@material-ui/core/MobileStepper';
import Countdown from 'react-countdown';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const service_url = process.env.REACT_APP_SERVICE_URL;

let socket;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    height: '100%',
    margin: '0px auto',
  },
  container: {
    marginTop: '20px',
    width: '85vw',
    minHeight: '400px'
  },
  time: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#303030',
  },
  ribbon: {
    position: 'relative',
    backgroundImage:`url(${ribbon})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '280px',
    height: '120px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
  },
  trophy: {
    position: 'relative',
    backgroundImage:`url(${trophy})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '180px',
    height: '180px ',
    margin: 'auto',
    marginTop: '60px',
  },
  groupName: {
    position: 'absolute',
    textAlign: 'center',
    marginTop: '15px',
    color: 'white',
    left: '90px',
    top: '12px',
    fontSize: '25px',
    fontWeight: 'bold',
  },
  clue: {
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
    color: '#303030',
    width: '80%',
    minHeight: '150px',
    margin: '0px auto',
    marginTop: '-20px',
    wordWrap: 'break-word', 
  },
  stepperContainer: {
    marginTop: '20px',
    marginBottom: '10px'
  },
  stepper: {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '25vw',
    backgroundColor: 'white',
  },
  linearProgress: {
    width: '100%',
  },
  challengesCounter: {
    textAlign: 'center',
    marginTop: '5px',
    color: '#3f51b5',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  gameWinner: {
    whiteSpace: 'pre-line',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#693fd3',
    color: 'white',
    width: '150px',
    height: '80px',
    margin: 'auto',
    padding: '10px',
    borderRadius: '10px'
  },
  
}));


const PlayGame = (props) => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("play");
    const [winner, setWinner] = useState('');

    const [gameData, setGameData] = useState({ groupName: "", clue: "", currentChallenge: 1, challenges: 1 , endTime: null});

    useEffect(() => { 
      socket = io(service_url);
  
      return () => {
        socket.emit('disconnect');
        socket.off();
      }
    }, []);


    useEffect(() => {
      socket.on("gameWinner", ({ winner }) => {
        setWinner(winner);
        setMode("results");
      });

      socket.on("gameData", ({ data }) => {
        console.log(data);
        setGameData(data)
      });

      socket.emit('playerJoinGame', { id: props.user._id }, (error) => {
        if (error) {
          setOpen(true);
          setMode("error");
        }
      });   
 
    }, []);

    const classes = useStyles();

    // Random component
    const Completionist = () => <Typography className={classes.time}>TIME'S UP</Typography>;
    

    // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        return <Completionist />;
      } else {
        // Render a countdown
        return <Typography className={classes.time}>Remaining Time: {hours}:{minutes}:{seconds}</Typography>;
      }
    };

    const play = () => {
      return (
      <div className={classes.wrapper}>
        <Paper elevation={3} className={classes.container}>
            <div className={classes.ribbon}>
                <Typography className={classes.groupName}> {gameData.groupName} </Typography>
            </div>
            <Typography className={classes.clue}> {gameData.clue} </Typography>

            <div className={classes.stepperContainer}>
                <MobileStepper className={classes.stepper} steps={gameData.challenges} variant="progress" activeStep={gameData.currentChallenge - 1} position="static" backButton={null} nextButton={null}
                LinearProgressProps={{ className: classes.linearProgress }}/>
                <Typography className={classes.challengesCounter}> {gameData.currentChallenge} / {gameData.challenges}</Typography>
            </div>
        </Paper>
        <Countdown date={moment(gameData.endTime).format()} renderer={renderer}/>
      </div>);   
    }

    const results = () => {
      return (
      <div className={classes.wrapper}>
        <Paper elevation={3} className={classes.container}>
        <div className={classes.trophy}></div>
            <Typography className={classes.gameWinner}>Game Winner {"\n"} {winner}</Typography>
        </Paper>
      </div>);   
    }

    const errorPlay = () => {
      return (
        <>
         <Dialog
         open={open}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description">
         <DialogTitle id="alert-dialog-title">{"Uh-oh! Something went wrong"}</DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">
             {"Unfortunately, QR GO has stopped working because of an unexpected error. We're sorry for the inconvenience!"}
           </DialogContentText>
         </DialogContent>
       </Dialog>   
       </> 
      );
    }

    return mode==="play" ? play() : (mode==="error" ? errorPlay() : results())

  }
  export default PlayGame;