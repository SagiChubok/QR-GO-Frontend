import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles( () => ({
    container: {
        position: 'relative',
        width: '96%',
        minHeight: '470px',
        backgroundColor: 'white',
        margin: '0px auto',
        top: '15%',
    },
    routeForm: {
        position: 'relative',
        marginTop: '1%',
        marginLeft: '5%',
        width: '45%',
        height: '410px',
    },
    formTitle: {
        color: '#693fd3',
        fontSize: '24px',
    },
    routeName: {
        backgroundColor: 'white',
        width: 428,
    },
    groupAmount : {
        backgroundColor: 'white',
        width: 382,
    },
    gameTime : {
        backgroundColor: 'white',
        width: 50,
    },
    formButton: {
        width: 150,
        color: '#ffffff',
        borderRadius: '8px',
        marginRight: '10px',
        border: `1px solid #693fd3`,
        background: '#693fd3',
        textTransform: 'none',
    }
}));

const BuildGame = (props) => {
    const classes = useStyles();
    const [game, setGame] = useState({id: "", route: "", createdAt: "", gameTimeHours: "",  gameTimeMinutes: "", groupsAmount: "", gamePin: "", state: ""});
    const [title, setTitle] = useState();
    const [buttonText, setButtonText] = useState();
    const [routes, setRoutes] = useState([]);
    const site_url = process.env.REACT_APP_SITE_URL;
    const service_url = process.env.REACT_APP_SERVICE_URL;
 
    useEffect(() => { 
        fetchRoutesData();
        getSpecificGame();
    }, []);

      const getSpecificGame = async () => {
        const value = queryString.parse(props.location.search);
        const id = value.id;
        if (id) {
            let data =[];
            try {
            data = await fetch(`${service_url}/api/games/${id}`).then(res => res.json());
            } catch(err) {
            console.log("error where fetching data");
            }
            setGame({id: data.game._id, route: data.game.route, createdAt: data.game.createdAt, gameTimeHours: data.game.gameTime.hours, gameTimeMinutes: data.game.gameTime.minutes, groupsAmount: data.game.groupsAmount, gamePin: data.game.gamePin, state: data.game.state});
            setTitle("Edit Specific Game");
            setButtonText("Confirm");   
        }
        else {
            setTitle("Create a New Game");
            setButtonText("Save");     
        }
    }


    const fetchRoutesData = async () => {
        // Fetch routes for Autocomplete component
        let data =[];
        try {
          data = await fetch(`${service_url}/api/routes`).then(res => res.json());
        } catch(err) {
          console.log("error where fetching data");
        }
        setRoutes(data.routes);
    };

    const handleFormButtonClick = () => {
        const gameTime = {
            hours: game.gameTimeHours,
            minutes: game.gameTimeMinutes
        }
        const body = {
            route: game.route._id,
            groupsAmount: game.groupsAmount,
            gameTime
        }

        if(buttonText === "Save") {
            // Handle save game
            fetch(`${service_url}/api/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then(response => response.json())
                .then(result => {
                    window.location.assign(`${site_url}/games`);
                })
        }
        else if(buttonText === "Confirm") {
            // Handle edit game
            fetch(`${service_url}/api/games/${game.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then(response => response.json())
                .then(result => {
                    window.location.assign(`${site_url}/games`);
                })
        }
    }

    return(
        <Paper elevation={3} className={classes.container}>
            <form className={classes.routeForm}>
                <Grid container spacing={4}>
                    <Grid container item xs={12} spacing={0}>
                        <Grid>   
                            <Typography className={classes.formTitle}>{title}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={0}>
                        <Grid> 
                            <Autocomplete className={classes.routeName} size="small" 
                            options={routes.sort((a, b) => -b.district.localeCompare(a.district))}
                            groupBy={(route) => route.district}
                            getOptionLabel={(route) => route ? route.routeName : ""}
                            onChange={(event, route) => {if (route) setGame({...game, route: route});  else {setGame(null);}  }}
                            value={game.route}                    
                            getOptionSelected={(route, value) => route.routeName === value.routeName }

                            renderInput={(params) => <TextField {...params} 
                              label="Route" variant="outlined" InputLabelProps={{ shrink: true }}/>} />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={0}>
                        <Grid item>
                            <FormControl size="small" variant="outlined" className={classes.formControl}>
                                <InputLabel shrink={true} htmlFor="outlined-age-native-simple" >Players Per Group</InputLabel>
                                <Select value={game.groupsAmount} onChange={e => setGame({...game, groupsAmount: e.target.value})} native label="District" inputProps={{ className: classes.groupAmount }} input={ <OutlinedInput notched labelWidth={133}/>} >
                                    <option value="" disabled hidden>&nbsp;</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>


                    <Grid container item xs={12} spacing={0}>
                        <Grid item xs={2}>
                            <TextField type="number" value={game.gameTimeHours} onChange={e => setGame({...game, gameTimeHours: e.target.value})} size="small" label="Hours" variant="outlined"
                            inputProps={{ className: classes.gameTime }} InputLabelProps={{ shrink: true }}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField type="number" value={game.gameTimeMinutes} onChange={e => setGame({...game, gameTimeMinutes: e.target.value})} size="small" label="Minutes" variant="outlined"
                            inputProps={{ className: classes.gameTime }} InputLabelProps={{ shrink: true }}/>
                        </Grid>
                    </Grid>

                    <Grid container item xs={4} spacing={0}>
                        <Grid>
                            <Button variant="contained" size="large" onClick={handleFormButtonClick} className={classes.formButton}>{buttonText}</Button>
                        </Grid>
                    </Grid> 
                </Grid>
            </form>
        </Paper>        

    );
}
export default BuildGame;