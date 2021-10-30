import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles( () => ({
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
        width: 400,
    },
    routeDistrict: {
        backgroundColor: 'white',
        width: 382,

    },
    routeImage : {
        backgroundColor: 'white',
        width: 400,
    },
    routeDescription : {
        backgroundColor: 'white',
        width: 400,
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

const RouteForm = (props) => {
    const classes = useStyles();
    const [route, setRoute] = useState({ id: "", routeName: "", district: "", description: "" , image: "", challengesAmount: null, challenges: [{qrData: "", qrUrl: "", clue: "", coordinate: {longitude: "", latitude: ""} }]});
      
    const [title, setTitle] = useState();
    const [buttonText, setButtonText] = useState();

    const site_url = process.env.REACT_APP_SITE_URL;
    const service_url = process.env.REACT_APP_SERVICE_URL;

    useEffect(() => { 
        getSpecificRoute();
    }, []);

    useEffect(() => { 
        if(props.challenges.length > 0) {
           setRoute({...route, challengesAmount: props.challenges.length, challenges: props.challenges} )
        }
    }, [props.challenges]);

      const getSpecificRoute = async () => {
        const id = props.routeId  
        if (id) {
            let data =[];
            try {
            data = await fetch(`${service_url}/api/routes/${id}`).then(res => res.json());
            } catch(err) {
            console.log("error where fetching data");
            }
            setRoute({ id: data.route._id, routeName: data.route.routeName, district: data.route.district, description: data.route.description , image: data.route.image, challengesAmount: data.route.challengesAmount, challenges: data.route.challenges});
            props.routeMode("Edit");
            props.currentRoute(data.route);
            setTitle("Edit Specific Route");
            setButtonText("Confirm");     
        }
        else {
            props.routeMode("Create");
            setTitle("Create a New Route");
            setButtonText("Save");     
        }
    }

    const handleFormButtonClick = () => {
        let challenges = [];
        route.challenges.map (
            challenge => {
                const coordinate = {
                    longitude : challenge.getLatLng().lng,
                    latitude : challenge.getLatLng().lat
                };
                const newChallenge = {
                    qrData : challenge.options.secretkey,
                    qrUrl : challenge.options.url,
                    clue : challenge.options.clue,
                    coordinate,
                };
                challenges.push(newChallenge);

              return challenge;
            }
          )

        const body = {
            routeName: route.routeName,
            district: route.district,
            description: route.description,
            image: route.image,
            challengesAmount: route.challengesAmount,
            challenges
        }

        if(buttonText === "Save") {
            // Handle save route
            fetch(`${service_url}/api/routes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then(response => response.json())
                .then(result => {
                    window.location.assign(`${site_url}/routes`);
                })
        }
        else if(buttonText === "Confirm") {
            // Handle edit route
            fetch(`${service_url}/api/routes/${route.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then(response => response.json())
                .then(result => {
                    window.location.assign(`${site_url}/routes`);
                })
        }
    }

    return(
        <form className={classes.routeForm}>
            <Grid container spacing={4}>
                <Grid container item xs={12} spacing={0}>
                    <Grid>   
                        <Typography className={classes.formTitle}>{title}</Typography>
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={0}>
                    <Grid>
                        <TextField value={route.routeName} onChange={e => setRoute({...route, routeName: e.target.value}) } size="small" label="Route Name" variant="outlined"
                        inputProps={{ className: classes.routeName }} InputLabelProps={{ shrink: true }} />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={0}>
                    <Grid item>
                        <FormControl size="small" variant="outlined" className={classes.formControl}>
                            <InputLabel shrink={true} htmlFor="outlined-age-native-simple" >District</InputLabel>
                            <Select value={route.district} onChange={e => setRoute({...route, district: e.target.value})} native label="District" inputProps={{ className: classes.routeDistrict }} input={ <OutlinedInput notched labelWidth={55}/>}>
                                <option value="" disabled hidden>&nbsp;</option>
                                <option value="Northern District">Northern District</option>
                                <option value="Haifa District">Haifa District</option>
                                <option value="Central District">Central District</option>
                                <option value="Tel Aviv District">Tel Aviv District</option>
                                <option value="Jerusalem District">Jerusalem District</option>
                                <option value="Southern District">Southern District</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={0}>
                    <Grid>
                        <TextField value={route.image} onChange={e => setRoute({...route, image: e.target.value})} size="small" label="Image" variant="outlined"
                        inputProps={{ className: classes.routeImage }} InputLabelProps={{ shrink: true }} />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={0}>
                    <Grid>
                        <TextField value={route.description} onChange={e => setRoute({...route, description: e.target.value})} size="small" label="Description" multiline rows={3}  variant="outlined"
                         inputProps={{ className: classes.routeDescription }} InputLabelProps={{ shrink: true }}/>
                    </Grid>
                </Grid>

                <Grid container item xs={4} spacing={0}>
                    <Grid>
                        <Button variant="contained" size="large" onClick={handleFormButtonClick} className={classes.formButton}>{buttonText}</Button>
                    </Grid>
                </Grid> 
            </Grid>
        </form>
    );
}
export default RouteForm;