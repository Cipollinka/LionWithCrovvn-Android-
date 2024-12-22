import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GameScreen from 'app/screens/game';
import HomeScreen from 'app/screens/home';
import MapScreen from 'app/screens/map';
import AnimalScreen from 'app/screens/animal';
import InitialScreen from 'app/screens/initial';
import SubModeScreen from 'app/screens/sub-mode';
import SettingsScreen from 'app/screens/settings';
import ChooseModeScreen from 'app/screens/choose-mode';
import ComplianceScreen from 'app/screens/compliance';
import EncyclopaediaScreen from 'app/screens/encyclopaedia';

import {navigationRef} from 'app/navigationRef';
import {useAppSelector} from 'app/store/hooks';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const {userInfo} = useAppSelector(state => state.core);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={userInfo?.name ? 'Home' : 'Initial'}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Initial" component={InitialScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Mode" component={ChooseModeScreen} />
        <Stack.Screen name="SubMode" component={SubModeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Animal" component={AnimalScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Encyclopaedia" component={EncyclopaediaScreen} />
        <Stack.Screen name="Compliance" component={ComplianceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
