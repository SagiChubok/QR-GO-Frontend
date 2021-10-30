import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Route from './Route'
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles( () => ({
  routesList: {
    paddingLeft: '10%',
    paddinRight: '10%',
    minHeight: '500px',
    width: '100%',
    paddingTop: '110px',
  },
  routesContainer: {
    clear: 'both',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
	  justifyContent: 'flex-start',
	  width: '90%',
    height: '90%',
    paddingTop: '80px',
	  paddingBottom: '30px',
  },
  actionButtons: {
    position: 'absolute',
    right: '20px',
  },
  selectDistrict: {
    color: '#ffffff',
    borderRadius: '8px',
    border: `1px solid #693fd3`,
    background: '#693fd3',
    textTransform: 'none',
  },
  clearFilter: {
    color: '#ffffff',
    borderRadius: '8px',
    marginRight: '10px',
    border: `1px solid #693fd3`,
    background: '#693fd3',
    textTransform: 'none',
  },
  addRoute: {
    fontSize: '65px',
    position: 'fixed',
    bottom: '5%',
	  right: '20px',
	  color: '#693fd3',
	  zIndex: 1,
  }
  }));

const RoutesList = (props) => {
  const classes = useStyles();
  const [routes, setRoutes] = useState([]);
  const service_url = process.env.REACT_APP_SERVICE_URL;

  useEffect(() => { 
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    let data =[];
    try {
      data = await fetch(`${service_url}/api/routes`).then(res => res.json());
    } catch(err) {
      console.log("error where fetching data");
    }
    data.routes.map(route => add({id: route._id, routeName: route.routeName, district: route.district, image: route.image, description: route.description, challengesAmount: route.challengesAmount}))
  }

  const nextId = (routes = []) => {    
    let max = routes.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id , 0);
    return ++max;
  };

  const add = (newRoute) => {
    setRoutes(prevState => ([
        ...prevState, {
            id: newRoute.id !== null ? newRoute.id : nextId(prevState),
            routeName: newRoute.routeName,
            district: newRoute.district,
            description: newRoute.description,
            image: newRoute.image,
            challengesAmount: newRoute.challengesAmount,
        }])
    )
  };

    const getAllRoutesByFilter = async (district) => {
      let filteredData =[];
      try {
        filteredData = await fetch(`${service_url}/api/routes?district=${district}`).then(res => res.json());
      } catch(err) {
        console.log("error where fetching data");
      }
      setRoutes([]);
      filteredData.routes.map(route => add({id: route._id, routeName: route.routeName, district: route.district, image: route.image, description: route.description, challengesAmount: route.challengesAmount}))
    }

    const deleteRoute = async (id) => {
      let result;
      try {
        result = await fetch(`${service_url}/api/routes/${id}`, {method: 'DELETE'}).then(res => res.json());
      } catch(err) {
        console.log("error where fetching data");
      }
      console.log(result);

      setRoutes(prevState => (
        prevState.filter((route, i) => route.id !== id)
      ))
    }

    const clearFilter = () => {
      setRoutes([]);
      fetchData();
    }

    const eachRoute = (item, index) => {
        return  (<Route key={item.id} index={index} route={item}
                  onClickDeleteBtn={deleteRoute}>                
                </Route>)
    };

    const districts = [ {value: "Northern District"}, {value: "Haifa District"}, {value: "Central District"},
                        {value: "Tel Aviv District"}, {value: "Jerusalem District"}, {value: "Southern District"} ];

    return( 
      <div className={classes.routesList}>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <div className={classes.actionButtons}>
                <Button className={classes.clearFilter} onClick={clearFilter} variant="contained">Clear</Button>
                <Button className={classes.selectDistrict} variant="contained" {...bindTrigger(popupState)}>Select District<ArrowDropDownIcon/></Button>
              </div>
              <Menu {...bindMenu(popupState)}>
              {districts.map((option) => (
                <MenuItem value={option.value} onClick={() => {getAllRoutesByFilter(option.value);  popupState.close();}}> {option.value} </MenuItem>
              ))}
              </Menu>                      
            </React.Fragment>
          )}
        </PopupState>
        <div className={classes.routesContainer}>
          { routes.map(eachRoute) }
        </div>
        <NavLink exact to={`/route`}>
          <AddCircleIcon className={classes.addRoute}/>
        </NavLink>
      </div>
           
    );   
  }
  export default RoutesList;