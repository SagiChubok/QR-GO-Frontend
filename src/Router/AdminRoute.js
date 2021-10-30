import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const AdminRoute = ({ component: Component, user, ...rest }) => {  
  return(
    <Route {...rest} render={(props) => (
       user ? (  user.role === "admin" ?  <Component {...props} user={user} /> : (<Redirect to={{path: '/', state: {from: props.location}}} />) ) : (<Redirect to={{path: '/', state: {from: props.location}}} />)
    )}
    />
  );
}

export default AdminRoute;