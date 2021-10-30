import React, {useState} from 'react';
import MapMarkers from './MapMarkers'
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';


const useStyles = makeStyles( () => ({
challengesContainer: {
    position: 'relative',
    marginTop: '1.5%',
    width: '45%',
    height: '428px',
},
  map: {
    width: '100%',
    height: '100%',
  }

  }));


const RouteMap = (props) => {
  const classes = useStyles();
  const [markers, setMarkers] = useState([]);
  props.challenges(markers);

  const handleNewMarker = (newMarker) => {
    setMarkers(prevState => ([
      ...prevState, newMarker
    ]));
  }

  const handleRemoveMarker = (markerIndex) => {
    console.log("markerIndexinRouteMap", markerIndex)
    console.log("markers", markers)
    setMarkers(prevState => (
      prevState.filter((marker, i) => marker.options.index !== markerIndex)
  ))
  }

  return( 
        <div className={classes.challengesContainer}>
          <MapContainer center={[32.0461, 34.8516]} zoom={7} scrollWheelZoom={true} className={classes.map}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FnaWNodSIsImEiOiJja2o3b3A4bGc2am5uMnNsYng0Yzg2dm9uIn0.rzN5tPVzLIflz5KXP1yPYw"
              maxZoom='18'
              accessToken= 'pk.eyJ1Ijoic2FnaWNodSIsImEiOiJja2o3b3A4bGc2am5uMnNsYng0Yzg2dm9uIn0.rzN5tPVzLIflz5KXP1yPYw'
            />
          <MapMarkers markers={markers} addMarker={handleNewMarker} removeMarker={handleRemoveMarker} routeMode={props.routeMode} currentRoute={props.currentRoute}/>
        </MapContainer>
      </div>
  );   
}
export default RouteMap;