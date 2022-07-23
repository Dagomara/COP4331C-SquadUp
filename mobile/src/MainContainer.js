import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet,View,Text,Image,Button,Alert,} from 'react-native';

//screens
import LoginPage from './login.js';
import HomePage from './home.js';
import Settings from './settings.js';
import Friends from './friends.js';

const loginName = 'Login';
const homeName = 'Home';
const settingsName = 'Settings';
const friendsName = 'Friends';

const Tab = createBottomTabNavigator();

export default function MainContainer(){

    return (

       <NavigationContainer>
            <Tab.Navigator
                initialRouteName = {loginName}


                screenOptions = { ({route}) =>({

                 headerTitle: () =>(
                      <Image
                            style={{width:150,height:50}}
                            source={require('./assets/Squadup_with_text_gradient_white.png')}
                            />
                    ),
                    headerStyle:{
                        backgroundColor:'purple',
                    },
                    tabBarIcon: ({focused, color,size}) =>{
                       let iconName;
                       let rn = route.name;

                       if(rn === loginName){
                            iconName = focused ? 'lock-open' : 'lock-open'
                       }
                       else if(rn === homeName){
                            iconName = focused ? 'home' : 'home-outline'
                       }
                       else if (rn === settingsName){
                            iconName = focused ? 'settings' : 'settings-outline'
                       }
                       else if(rn === friendsName){
                            iconName = focused ? 'list' : 'list-outline'
                       }

                       return <Ionicons name = {iconName} size={size} color={color} />
                    },
                    tabBarActiveTintColor:'purple',
                    tabBarInactiveTintColor:"grey",
           })}

           >

          <Tab.Screen name = {loginName} component = {LoginPage} />
          <Tab.Screen name = {homeName} component = {HomePage} />
          <Tab.Screen name = {friendsName} component = {Friends} />
          <Tab.Screen name = {settingsName} component = {Settings} />

            </Tab.Navigator>
       </NavigationContainer>

    );
}
function LogoTitle(){
    return(
        <Image
        style={{width:50,height:50}}
        source={require('./assets/Squadup_with_text_gradient_white.png')}
        />
    );

}