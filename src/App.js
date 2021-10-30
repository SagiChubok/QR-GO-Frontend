import './App.css';
import Header from './Components/Header';
import HeaderMobile from './Components/HeaderMobile';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage'
import useMediaQuery from '@material-ui/core/useMediaQuery';


const App = ( {children} ) => {

  const location = useLocation();

  const [bgColor, SetBgColor] = useState();
  const [headerMode, SetHeaderMode] = useState();
  const [user] = useLocalStorage('user');
  const isMobile = useMediaQuery('(max-width:800px)');

  useEffect(() => {
    const currentPath = location.pathname;

    if(user) {
      if( ((currentPath === '/join' || currentPath === '/join/') && user.role === 'player') || ((currentPath === '/play' || currentPath === '/play/') && user.role === 'player') || ((currentPath === '/lobby' || currentPath === '/lobby/') && user.role === 'admin' )) {
        SetHeaderMode("LogoutOnlyHeader");
      }
      else if(user.role === 'admin' && 
      ((currentPath === '/games' || currentPath === '/games/') || (currentPath === '/game' || currentPath === '/game/') ||
       (currentPath === '/routes' || currentPath === '/routes/') || (currentPath === '/route' || currentPath === '/route/') || (currentPath === '/statistics' || currentPath === '/statistics/'))){
        SetHeaderMode("AdminHeader");
      } else {
        SetHeaderMode("NotFoundHeader");
      } 
    }
    else if (currentPath === '/') {
      SetHeaderMode("HomePageHeader");
      SetBgColor('linear-gradient( #693fd3, #693fd3,#4822a7, #4822a7)');
    }
    else {
      SetHeaderMode("NotFoundHeader");
    }
  }, [location.pathname]);

  const desktopUI = () => {
    return (
        <div style={{ background: bgColor}} id='main'>
          <Header changeHeader={headerMode}/>
          {children}
        </div>
      );
  }
  const mobileUI = () => {
    return (
        <div style={{ background: bgColor}} id='main'>
          <HeaderMobile changeHeader={headerMode}/>
          {children}
        </div>
      );
    }
  return isMobile ? mobileUI() : desktopUI()
}

export default App;