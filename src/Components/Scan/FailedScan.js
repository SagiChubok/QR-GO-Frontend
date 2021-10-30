import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    margin: '0px auto',
  },
 icon: {
    fontSize: '80px',
    color: '#f84545'
 },
 text: {
    marginTop: '15px',
    fontSize: '25px',
    color: '#303030' }
}));

const FailedScan = () => {
    const classes = useStyles();

      return (
        <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
                <div className={classes.wrapper}>
                    <ErrorIcon className={classes.icon}/>
                    <Typography className={classes.text}>{"Failed Scan!"}</Typography>
                </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      );
  
  }
  export default FailedScan;