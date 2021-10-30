import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import printQrIcon from '../../Images/qr.png'
const useStyles = makeStyles( (theme) => ({
    challengeForm: {
        marginTop: 30,
    },
    dialogTitle: {
        color: '#693fd3',
    },
    secretkey: {
        backgroundColor: 'white',
        width: 400,
    },
    printButton: {
        color: '#693fd3',
        border: `1px solid #693fd3`,
        textTransform: 'none',
        backgroundImage:`url(${printQrIcon})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '40px',
        minWidth: '40px',
        maxHeight: '40px',
        minHeight: '40px'
    },
    clue: {
        backgroundColor: 'white',
        width: 464,
        [theme.breakpoints.down('sm')]: {
            width: 400,
        },
    },
    closeButton: {
        color: '#693fd3',
        border: `1px solid #693fd3`,
        textTransform: 'none',
        float: 'right',
        marginRight: 60,
        [theme.breakpoints.down('sm')]: {
            float: 'none',
            marginLeft: '10%',
        },
    },
    deleteButton: {
        color: '#693fd3',
        border: `1px solid #693fd3`,
        textTransform: 'none',
    }
}));

const ChallengeDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const [challenge, setChallenge] = useState({ index: "", coordinate: {longitude: "", latitude: ""}, secretkey: "", url: "", clue: ""});
  
  const handleClose = () => {
    props.onClose(false);
  };

  const getCurrentMarker = () => {
    if(props.currentMarker) {
      setChallenge({ index: props.currentMarker.options.index, coordinate: {longitude: props.currentMarker.getLatLng().lng, latitude: props.currentMarker.getLatLng().lat}, secretkey: props.currentMarker.options.secretkey, url: props.currentMarker.options.url, clue: props.currentMarker.options.clue})
    }
  };
  
  useEffect(() => { 
    setOpen(props.dialogMode);
    getCurrentMarker();
}, [props.dialogMode]);

const updateClue = (clue) => {
  props.markers.map (
    marker => {
      if(marker.options.index === challenge.index) {
        marker.options.clue = clue;
      }
      return marker;
    }
  )
}

const imagetoPrint = (qrUrl) => {
  const newHtmlPage =
  `<!DOCTYPE html>
  <html>
  <head><title>Print QR</title></head>
  <body>
  <h1>${`(${challenge.coordinate.latitude},${challenge.coordinate.longitude})`}</h1>
  <img src='data:image/png;base64, ${qrUrl}'/>
  <script>
  document.body.onload = () => {
      setTimeout('printPopup()', 10);}
      function printPopup(){window.print();window.close()
  };
  </script>
  </body>
  </html>`;
return newHtmlPage;
}

const handlePrint = () => {
  const newWindow = window.open('_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
  newWindow.document.write(imagetoPrint(challenge.url));
  newWindow.document.close();
}
   
  return (
    <div>
      <Dialog open={open}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle className={classes.dialogTitle}>{`Challange Coordinates (${challenge.coordinate.latitude},${challenge.coordinate.longitude})`}</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            <form className={classes.challengeForm}>
                <Grid container spacing={4}>

                    <Grid container item xs={12} spacing={3}>
                        <Grid item s={10}>
                            <TextField value={challenge.secretkey} onChange={e => setChallenge({...challenge, secretkey: e.target.value}) } size="small" label="Secret Key" variant="outlined" disabled={true}
                            inputProps={{ className: classes.secretkey }} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={2}>
                            <Button className={classes.printButton} onClick={handlePrint} variant="contained"></Button>
                        </Grid>
                    </Grid>
                  
                    <Grid container item xs={12} spacing={0}>
                        <Grid>
                            <TextField value={challenge.clue} onChange={(e) => { updateClue(e.target.value); setChallenge({...challenge, clue: e.target.value}); }}  multiline rows={4} size="small" label="Clue" variant="outlined"
                            inputProps={{ className: classes.clue }} InputLabelProps={{ shrink: true }} />
                        </Grid>
                    </Grid>
                </Grid>

            </form>
          </DialogContentText>
        </DialogContent>
        <Divider />

        <DialogContent>
          <DialogContentText>

          <Button className={classes.deleteButton} autoFocus onClick={() => props.removeMarker(challenge.index)} variant="outlined" color="primary">
              <DeleteIcon/>
          </Button>
          <Button className={classes.closeButton} autoFocus onClick={handleClose} variant="outlined" color="primary" >
            Close Challenge
          </Button>

        </DialogContentText>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}
export default ChallengeDialog;