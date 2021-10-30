import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PlayerRoute = ({ component: Component, user, ...rest }) => {  
  return(
    <Route {...rest} render={(props) => (
       user ? (  user.role === "player" ?  <Component {...props} user={user} /> : (<Redirect to={{path: '/', state: {from: props.location}}} />) ) : (<Redirect to={{path: '/', state: {from: props.location}}} />)
    )}
    />
  );
}

export default PlayerRoute;