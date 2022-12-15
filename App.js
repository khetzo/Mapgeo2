import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
  Linking,
} from "react-native";
import MapView, { Marker, Callout, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { locations } from "./Data";
import MapViewDirections from "react-native-maps-directions";
//Function to get permission for location
const { width, height } = Dimensions.get('window');
export default function App() {
  const GOOGLE_MAPS_APIKEY = "";

  const [location, setLocation] = useState({
    latitude: -23.881779,
    longitude: 29.729599,
  });
  const [errorMsg, setErrorMsg] = useState(null);



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("coords2222222 ", location);
    
    })();
  }, []);

 
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }


  // ------about derection 
 
  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  setInterval(myTimer, 1000); 
// thise fuction will upodate evry seccond... note in sude now
  function myTimer() {

  //put your code hire
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.881779,
          longitude: 29.729599,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0021,
        }}
        //  userInterfaceStyle = "dark" ::note:: for ios only
        mapType="standard"
        ref={c => this.mapView = c}
        onPress={this.onMapPress}
        showsTraffic={true}
        
        showsUserLocation={true}
       /* 
        onUserLocationChange = {(e)=>{
          console.log("ongrage moving", e.nativeEvent.coordinate)
          setLocation({
            latitude: e.nativeEvent.coordinate.altitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
    
        }}
        */
      >
        <Marker
          coordinate={location}
          pinColor="green"
          draggable={true}
          flat={true}
          // isPreselected ={false}
          onPress={(e) =>
            console.log("onplress event ", e.nativeEvent.coordinate)
          }
          onDragStart = {(e)=>{
            console.log("ongrage start", e.nativeEvent.coordinate)
          }}
          onDragEnd = {(e)=>{
            console.log("ongrage end", e.nativeEvent.coordinate)
          }}

        
        >

          <Callout>
            <Text>Latitude: </Text>
          </Callout>
        </Marker>

        <Circle
          center={location}
          geodesic={true}
          radius={900}
          strokeColor="rgba(67, 145, 181,0.9)"
        ></Circle>

        {locations.map((marker, index) => (
          <Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            key={`coordinate_${index}`}
          ></Marker>
        ))}
  <MapViewDirections
          origin={location}
          destination={{
            latitude: -23.885193,
            longitude: 29.713543,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
          optimizeWaypoints={true}
         // waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): undefined}

          onStart={(params) => {
            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={result => {
            console.log(`Distance: ${result.distance} km`)
            console.log(`Duration: ${result.duration} min.`)

            this.mapView.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: (width / 20),
                bottom: (height / 20),
                left: (width / 20),
                top: (height / 20),
              }
            });
          }}
          onError={(errorMessage) => {
            console.log('GOT AN ERROR',errorMessage);
          }}
        />
      
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
