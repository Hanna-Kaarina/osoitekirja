import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard, FlatList, Alert } from 'react-native';
import { Input, ListItem, Button, Icon, Header } from 'react-native-elements';
import * as SQLite from 'expo-sqlite'; //expo install expo-sqlite 

const db = SQLite.openDatabase("test.db");

export default function Koti({ navigation }) {
  const [input, setInput] = useState("");
  const [errorTxt, setErrorTxt] = useState("");
  const [addressList, setAddressList] = useState([]);

  const search = () => {
   let keyword = input.trim().replace(/ /g, '+');
    fetch(`https://nominatim.openstreetmap.org/search?q=${keyword}&format=json`)
    .then(response => response.json())
    .then(data => {
      if (data == []) {
        setErrorTxt("Osoitteen näyttö epäonnistui, yritä toista osoitetta");
      } else {
        save(parseFloat(data[0].lat), parseFloat(data[0].lon));
      }
    })
    .catch(error => {
      console.log(error);
      setErrorTxt("Osoitteen haku epäonnistui, yritä uudestaan");
    });
  }

  const save = (lat, lon) => {
    db.transaction(tx => {
      tx.executeSql('insert into address (address, latitude, longitude) values (?, ?, ?);',
        [input.trim(), lat, lon]);
      }, null, updateList);
    setInput("");
    Keyboard.dismiss();
  }

  const updateList = () => {
    setErrorTxt("");
    db.transaction(tx => {
      tx.executeSql('select * from address;', [], (_, { rows }) => {
      setAddressList(rows._array)
      });
    });
  }

  const triggerAlert = (id) => {
    Alert.alert(
      "Oletko varma, että haluat poistaa osoitteen?",
      "",
      [
        { text: "Peruuta" },
        {
          text: "Poista",
          onPress: () => deleteItem(id)
        },
      ],
      { cancelable: true }
    )
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from address where id = ?;`, [id]);
      }, null, updateList
    )
  }

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists address (id integer primary key not null, address text, latitude numeric, longitude numeric);');
    }, null, updateList);
  }, []);
  
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <Header   
      centerComponent={{ text: 'OSOITEKIRJA', style: { color: '#fff' } }}  
     />
     <View style={{height: 50}}></View>
        <Input
          style={{ paddingLeft: 4,}}
          value={input}
          placeholder="Kirjoita osoite"
          leftIcon={{ type: 'entypo', name: 'address' }}
          onChangeText={input => setInput(input)}
        />
        <Button
          onPress={search}
          title="Tallenna"
          icon={{ type: 'material', name: 'add-location', color: "white"}}
        />
        {<Text style={{color: "red"}}>{errorTxt}</Text>}
      <View style={{width: "100%"}}>
      <FlatList
        data={addressList}
        contentContainerStyle={{ marginTop: 10 }}
        ListEmptyComponent={<Text>Lista on tyhjä, lisää osoite.</Text>}
        keyExtractor={item => item.id.toString()} 
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('Kartta', {item})}
            onLongPress={() => triggerAlert(item.id)}
          >
            <ListItem.Content>
              <ListItem.Title>{item.address}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
              <ListItem.Subtitle>Paina katsoaksesi</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>)}
      />
      </View>
    </View>
  );
  }

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'flex-start',
},
});