import React, { Component } from 'react';
import { Alert, TextInput, Text, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SideMenu, Button } from 'react-native-elements';

import Register from './Register'


export default class Menu extends React.Component {

  render() {
    return (
      <View style={styles.container}>

        <Button
          title="Mode manuel"
          onPress={() => Actions.manual()}
        />
        <Button
          title="Mda"
          onPress={() => Actions.mda()}
        />
        <Button
          title="Parametres"
          onPress={() => Actions.settings()}
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
