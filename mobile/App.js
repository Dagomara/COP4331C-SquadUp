import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { BackHandler,StyleSheet, Text, View } from 'react-native';
import MainContainer from './src/MainContainer';
import LoginPage from './src/login';
import {NavigationContainer,useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


export default function App({navigation}) {

    global.data;
    global.id;

    return (
        //<LoginPage />

        <MainContainer />
    );
}


