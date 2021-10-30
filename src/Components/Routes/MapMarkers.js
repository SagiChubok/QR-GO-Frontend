
import React, {useState, useEffect} from 'react';
import ChallengeDialog from './ChallengeDialog'
import { useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import QrGoMarker from '../../Images/marker.png' 
import QrGoMarkerShadow from '../../Images/shadow.png'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( () => ({
    dialog: {
      width: '100%',
      height: '100%',
    }
  
    }));
  

  const MapMarkers = (props) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [currentMarker, setCurrentMarker] = useState();
    const [markerIndex, setMarkerIndex] = useState(1);
    const service_url = process.env.REACT_APP_SERVICE_URL;

    const extendIcon = L.Icon.extend({
      options: {
      iconSize:     [30, 38], // size of the icon
      shadowSize:   [42, 36], // size of the shadow
      iconAnchor:   [9, 16], // point of the icon which will correspond to marker's location
      }
    });

    const myIcon = new extendIcon({
      iconUrl: QrGoMarker,
      shadowUrl: QrGoMarkerShadow,
  })

  useEffect(() => { 
    if( props.routeMode === "Edit" ) {
      addMarkerEditMode(props.currentRoute.challenges);
      flyToDistrict(props.currentRoute.district)
    }
  }, [props.currentRoute]);

  const flyToDistrict = (district) => {
    if (district === "Northern District") {
      const lat = 32.8972;
      const lng = 35.3027;
      map.flyTo([lat, lng], 10, {
        duration: 3,
      });
    } else if (district === "Haifa District") {
      const lat = 32.7014;
      const lng = 34.9948;
      map.flyTo([lat, lng], 10.5, {
        duration: 3,
      });
    } else if (district === "Central District") {
      const lat = 32.1021;
      const lng = 34.80366;
      map.flyTo([lat, lng], 10.5, {
        duration: 3,
      });
    } else if (district === "Tel Aviv District") {
      const lat = 32.1024253;
      const lng = 34.7557067;
      map.flyTo([lat, lng], 11.5, {
        duration: 3,
      });
    } else if (district === "Jerusalem District") {
      const lat = 31.7427993;
      const lng = 35.0526076;
      map.flyTo([lat, lng], 11, {
        duration: 3,
      });
    } else if (district === "Southern District") {
      const lat = 30.3378277;
      const lng = 34.807793;
      map.flyTo([lat, lng], 8, {
        duration: 3,
      });
    }
  }

  const addNewMarker = (e, qr) => {
    const newMarker = new L.marker([e.latlng.lat, e.latlng.lng], {
      index: markerIndex,
      icon: myIcon,
      secretkey: qr.secretkey,
      url: qr.url,
      clue: "",
    }).addTo(map);

    props.addMarker(newMarker);

    newMarker.on({
      click: () => {
        setCurrentMarker(newMarker);
        setOpen(true);
      },
    });

    setMarkerIndex(markerIndex + 1);
  }

  const generateQR = async (e) => {
    let data =[];
    try {
      data = await fetch(`${service_url}/api/qr`, {method: 'POST'}).then(res => res.json());
    } catch(err) {
      console.log("error where fetching data");
    }
    if(data) {
      addNewMarker(e, data);
    }
  }

  const addMarkerEditMode = (challenges) => {
    let currentIndex = 1;
    challenges.map (
      challenge => {
        const newMarker = new L.marker([challenge.coordinate.latitude, challenge.coordinate.longitude], {
          index: currentIndex++,
          icon: myIcon,
          secretkey: challenge.qrData,
          url: challenge.qrUrl,
          clue: challenge.clue,
        }).addTo(map);

        props.addMarker(newMarker);

        newMarker.on({
          click: () => {
            setCurrentMarker(newMarker);
            setOpen(true);
          },
        });
    
        return challenge;
      }
    )
    setMarkerIndex(currentIndex);
  }

  const removeMarker = (markerIndex) => {
    console.log("markerIndex", markerIndex)
    console.log("props.markers", props.markers)

    props.markers.map (
      marker => {
        if(marker.options.index === markerIndex) {
          map.removeLayer(marker);   
          props.removeMarker(markerIndex);
          setOpen(false)
        }
        return marker;
      }
    )
  }

    const map = useMapEvents({
      click: (e) => {
        if( props.routeMode === "Create") {
          generateQR(e);
        }
        if( props.routeMode === "Edit") {
          generateQR(e);
        }    
      },     
    });

   

    return ( 
      <ChallengeDialog className={classes.dialog} markers={props.markers} currentMarker={currentMarker} routeMode={props.routeMode} removeMarker={removeMarker} dialogMode={open} onClose={() => setOpen(false)} /> 
    );
  };
  export default MapMarkers;