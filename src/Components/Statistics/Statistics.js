import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import trophy from '../../Images/trophy.svg'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import randomColor from "randomcolor";
import queryString from 'query-string'

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: '95%',
        height: '100%',
        margin: '0px auto',
      },
      container: {
        width: '85vw',
        minHeight: '400px'
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
        marginTop: '100px',
      },
      gameWinner: {
        whiteSpace: 'pre-line',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        backgroundColor: '#693fd3',
        color: 'white',
        width: '300px',
        height: '80px',
        margin: 'auto',
        padding: '10px',
        borderRadius: '10px'
      },
      chartContainer: {
        marginTop: '20px',
        backgroundColor:'white',
        width: '100%',
        minHeight: '350px',
        overflowX: 'auto',
      },
      lineChart: {
        margin: '20px auto',
        width: '100%'
      }
}));

const Statistics = (props) => {
    const classes = useStyles();
    const [gameData, setGameData] = useState([]);
    const [groupsOnGame, setGroupsOnGame] = useState([]);
    const [gameWinner, setGameWinner] = useState();
    const value = queryString.parse(props.location.search);
    const gameId = value.id;
    const service_url = process.env.REACT_APP_SERVICE_URL;

    useEffect(() => { 
        fetchData();
        fetchWinner();
      }, []);
    
      const fetchData = async () => {
        let data;
        try {
          data = await fetch(`${service_url}/api/statistics/${gameId}`).then(res => res.json());
        } catch(err) {
          console.log("error where fetching data");
        }
        setGameData(data.data.gameData);
        setGroupsOnGame(data.data.groupsOnGame);
      }

      const fetchWinner = async () => {
        let data;
        try {
          data = await fetch(`${service_url}/api/games/${gameId}`).then(res => res.json());
        } catch(err) {
          console.log("error where fetching data");
        }
        setGameWinner(data.game.winner);
      }

    const eachGroup = (group, index) => {
        let color = randomColor();
        return  (<Line type="monotone" dataKey={group} stroke={color} />)
      };

      return (
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <div className={classes.trophy}></div>
                <Typography className={classes.gameWinner}>Game Winner {"\n"} {gameWinner}</Typography>
                <div className={classes.chartContainer}>
                    <LineChart width={1000} height={300} data={gameData} margin={{ top: 5, right: 60, left: 0, bottom: 5 }} className={classes.lineChart}  >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {groupsOnGame.map(eachGroup)};
                    </LineChart>
                </div>
            </div>
        </div>
      );
  
  }
  export default Statistics;