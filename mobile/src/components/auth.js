import axios from 'axios';
import {StyleSheet,View,Text,Image,Button,Alert,} from 'react-native';
import React, { useState, useEffect } from 'react';
//import MainContainer from './../MainContainer';
import * as Linking from 'expo-linking';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import getProfile from './getProfile';


async function exchange_code(code)
{

    const client_ID = require ('./../../config.json').CLIENT_ID;
    const client_SECRET = require ('./../../config.json').CLIENT_SECRET;
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const REDIRECT_URI = "https://auth.expo.io/@azoomer2/squadup";

   //Alert.alert("Client ID",client_ID);

    const config = {
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            "Access-Control-Allow-Origin": "*"
            }


    };
    const data = {
            'client_id': client_ID,
            'client_secret': client_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            "scopes": "identify guilds guilds.join",
            'redirect_uri': REDIRECT_URI
    };

    await axios.post("https://discord.com/api/oauth2/token",new URLSearchParams(data).toString())
        .then(function(response){

            return response.data;
        })
        .then(async (response) => {

                    // First, get the user.
                    await axios.get("https://discordapp.com/api/users/@me", {
                      headers: {
                        'Authorization': `${response.token_type} ${response.access_token}`
                      }
                    })
                    .then((res2) => {
                        // console.log("res2.data: ");
                        // console.log(res2.data);
                        return res2.data;
                    })
                    .then(async (userResponse) =>{
                        global.id = `${userResponse.id}`

                        username = `${userResponse.username}#${userResponse.discriminator}`
                        //Alert.alert("username", global.id);
                        req.session.userdata = userResponse
                    });
        })
        .catch(function(error){

             //Alert.alert("error",JSON.stringify(error,null,2));
        })








}
export default exchange_code;