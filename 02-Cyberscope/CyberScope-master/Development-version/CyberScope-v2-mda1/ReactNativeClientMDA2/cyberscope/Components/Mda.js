import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, Image, StyleSheet, Button, SafeAreaView, ScrollView, ToastAndroid } from 'react-native'
import { Card, ListItem, Icon } from 'react-native-elements'

import Register from './Register'


export default class Payments extends React.Component {

  render() {
    return (
        
        <SafeAreaView>
         <ScrollView> 
            <View style={styles.container}>

                    
                    <Button
                        title="Signaler un problème"
                        color="red"
                    />
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
