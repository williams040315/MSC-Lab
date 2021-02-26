import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, Image, StyleSheet, Button } from 'react-native'
import { Card, ListItem, Icon } from 'react-native-elements'

import Register from './Register'


export default class Infos extends React.Component {

  render() {
    return (
      <View style={styles.container}>

            <Card title="Mes infos">
            {
                users.map((u, i) => {
                return (
                    <View key={i} style={styles.user}>
                    <Image
                        style={styles.image}
                        resizeMode="cover"
                        source={{ uri: u.avatar }}
                    />
                    <Text style={styles.name}>{u.name}</Text>
                    <Text style={styles.name}>{u.rib}</Text>
                    <Text style={styles.name}>{u.rate}</Text>
                    <Text style={styles.name}>{u.email}</Text>
                    <Text style={styles.name}>{u.address}</Text>
                    <Text style={styles.name}>{u.zipcode}</Text>
                    </View>
                );
                })
            }
            </Card>
            <Button
                title="Supprimer mon compte"
                color="red"
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

const users = [
    {
       name: 'Pierre-Louis CRESCITZ',
       rib: 'FR11 3234 2322 3232 21',
       rate: '4.7',
       email: 'pi.loutre@crou.fr',
       address: '25 rue pasteur',
       zipcode: '94270 LE KREMLIN BICETRE',
       avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
    },
   ];