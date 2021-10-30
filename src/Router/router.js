import React from 'react';
import { Route, Switch } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage'
import Home  from '../Components/Home/Home';
import RoutesList  from '../Components/Routes/RoutesList';
import BuildRoute  from '../Components/Routes/BuildRoute';
import GamesTables  from '../Components/Games/GamesTables';
import BuildGame  from '../Components/Games/BuildGame';
import Lobby  from '../Components/Lobby/Lobby';
import Statistics  from '../Components/Statistics/Statistics';
import Join  from '../Components/Play/Join';
import PlayGame  from '../Components/Play/PlayGame';
import SuccessfulScan  from '../Components/Scan/SuccessfulScan';
import FailedScan  from '../Components/Scan/FailedScan';
import NotFound  from '../Components/NotFound/NotFound';
import AdminRoute from './AdminRoute'
import PlayerRoute from './PlayerRoute'

const ReactRouter = () => {

  const [user] = useLocalStorage('user');
  
  return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />}/>
        <AdminRoute exact={true} path="/routes" component={RoutesList} user={user}/>
        <AdminRoute exact={true} path="/route" component={BuildRoute} user={user}/>
        <AdminRoute exact={true} path="/games" component={GamesTables} user={user}/>
        <AdminRoute exact={true} path="/game" component={BuildGame} user={user}/>
        <AdminRoute exact={true} path="/lobby" component={Lobby} user={user}/>
        <AdminRoute exact={true} path="/statistics" component={Statistics} user={user}/>
        <PlayerRoute exact={true} path="/join"  component={Join} user={user}/>
        <PlayerRoute exact={true} path="/play" component={PlayGame} user={user}/>
        <PlayerRoute exact={true} path="/successful-scan" component={SuccessfulScan} user={user}/>
        <PlayerRoute exact={true} path="/failed-scan" component={FailedScan} user={user}/>
        <Route path='*' render={props => <NotFound {...props} />} />
      </Switch>
  );
}
export default ReactRouter;

