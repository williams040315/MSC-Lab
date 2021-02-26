import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import Login from './Components/Login';
import Register from './Components/Register';
import Menu from './Components/Menu';
import Settings from './Components/Settings';
import Manual from './Components/Manual';
import Mda from './Components/Mda'

/*export default function App() {
  return (
    <Login style={styles.container} />
  );
}*/

export default App = () => {
  return (
    <Router>
      <Scene key="root">
        
        <Scene 
          key="login"
          component={Login}
          title="Login"
          initial={true}
        />

        <Scene 
          key="register"
          component={Register}
          title="Register"
        />

        <Scene
          key="menu"
          component={Menu}
          title="Menu"
        />

        <Scene
          key="manual"
          component={Manual}
          title="Mode Manuel"
        />

        <Scene
          key="mda"
          component={Mda}
          title="MultiDimensionalAcquisition"
        />

        <Scene
          key="settings"
          component={Settings}
          title="Parametres"
        />

      </Scene>
    </Router>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    //marginTop: 50,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
