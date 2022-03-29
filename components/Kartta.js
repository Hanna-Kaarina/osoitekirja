import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


export default function Kartta({ route }) {
  
  const { item } = route.params;
  
  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={{
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      }}>

      {}
      <Marker
        coordinate={{
          latitude: item.latitude,
          longitude: item.longitude}}
        title={item.address}
        pinColor="indigo" />
    </MapView>
    </View>
  );
  }

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
});