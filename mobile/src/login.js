import React,{useState} from 'react';

import {ActivityIndicator,TouchableOpacity,StyleSheet,View,Text,Image,Button,Alert,} from 'react-native';
import { authorize } from 'react-native-app-auth';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


import exchange_code from './components/auth.js';
import getProfile from './components/getProfile.js';

const clientId = require("./../config.json").CLIENT_ID;
const clientSecret = require("./../config.json").CLIENT_SECRET;
const port = require("./../config.json").PORT;



import{NavigationContainer,useNavigation} from '@react-navigation/native';
import{createNativeStackNavigator} from '@react-navigation/native-stack';



const redirectURL = "https://auth.expo.io/@azoomer2/squadup";


 var key = null;
function LoginPage({navigation}){

//Alert.alert("clientId", clientId);


const[loadWheel,setLoadWheel] = useState(false);


const[isDisabled,setIsDisabled] = useState(false);
const[isDisabled2,setIsDisabled2] = useState(false);

if(isDisabled2){
    navigation.setOptions({tabBarStyle: {position: 'absolute'},});
}
else{
navigation.setOptions({tabBarStyle: {display: 'none'},});
}

const config = {
  authUrl: "https://discord.com/api/oauth2/authorize?response_type=code&client_id="+clientId+"&scope=identify%20guilds.join&state=15773059ghq9183habn&redirect_uri=https://auth.expo.io/@azoomer2/squadup",
  clientId: clientId,
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUrl: redirectURL,
  scopes: ['email', 'identify'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://discordapp.com/api/oauth2/authorize',
    tokenEndpoint: 'https://discordapp.com/api/oauth2/token',
    revocationEndpoint: 'https://discordapp.com/api/oauth2/token/revoke'
  }
};
async function auth(){


    setIsDisabled(true);
    key = await AuthSession.startAsync(config);




};
function callAuth(){
    (async () => {await auth();
    })();


}

function toApp({navigation})
{

    //keyCheck();
    navigation.navigate("home");



}




function keyCheck(){



setIsDisabled2(true);
setLoadWheel(true);
      //Alert.alert("key",JSON.stringify(key));

    if(key.type == 'success'){
            key=key.params.code;

        }
        else{
           Alert.alert("Error",key.errorCode);
        }

  ;
    exchange_code(key);
    setTimeout(()=>{setLoadWheel(false);},2000);
    //setTimeout(()=>{Alert.alert("ID",global.id);},500);
    setTimeout(()=>{getProfile(global.id);},500);
    //setTimeout(()=>{Alert.alert("ID",JSON.stringify(global.data,null,2));},1000);
}

    return (
        <View style={styles.container}>
            <View style = {styles.inputContainer}>

                <Image
                    style = {styles.logo}
                    source = {require('./assets/Squadup_with_text_gradient_white.png')}
                />
                <Button title = "Login With Discord" disabled ={isDisabled} onPress={callAuth} />

                <View style = {styles.button}>
                    <Button title = "Continue to App!" disabled={isDisabled2 || !isDisabled} onPress={()=> { keyCheck(); setTimeout(()=>{navigation.navigate('Home')},2000); } }/>
                </View>
            </View>

           <View style = {styles.wheel}>
                {   loadWheel &&
                    <ActivityIndicator size= "large" color="#00ff00" />
                }



           </View>

        </View>
  );
}



   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: 'purple',
       alignItems: 'center',
       justifyContent: 'center',
     },
     logo:{
        resizeMode: "cover",
        width: 400,
        height: 140,
        marginBottom: 80,
     },
     inputContainer:{

        marginTop:20,
        flexDirection: 'column',
        justifyContent: 'space-between',

     },
     button:{
        marginVertical: 20,
     },
     wheel:{
          height:100,
          width:100,
          marginBottom:10,
     },

});

export default LoginPage;