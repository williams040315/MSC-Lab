import React, { Component } from 'react';
import { Alert, TextInput, Text, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SideMenu, Button, Card } from 'react-native-elements';

import Register from './Register'


export default class Order extends React.Component {

  render() {
    return (
        <SafeAreaView>
        <ScrollView> 
           <View style={styles.container}>
                <Card title={data[0].name}>
                    <View  style={styles.user}>
                    <Text style={styles.name}>Name: {data[0].name}</Text>
                    <Text style={styles.name}>Status: {data[0].status}</Text>
                    </View>
                </Card>
                <Card title={data[1].name}>
                    <View  style={styles.user}>
                    <Text style={styles.name}>Name: {data[1].name}</Text>
                    <Text style={styles.name}>Status: {data[1].status}</Text>
                    </View>
                </Card>
                <Card title={data[2].name}>
                    <View  style={styles.user}>
                    <Text style={styles.name}>Name: {data[2].name}</Text>
                    <Text style={styles.name}>Status: {data[2].status}</Text>
                    </View>
                </Card>
                
           </View>
           </ScrollView>
    </SafeAreaView>
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

const data = [
    {
       name: "CoolLed-pE4000", 
       status: "Connected"
    },
    {
      name: "Olympus-IX81", 
      status: "Connected"
    },
    {
      name: "Mosaic", 
      status: "Connected"
    },
   ];