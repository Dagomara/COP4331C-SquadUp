import {Alert} from 'react-native';

import axios from 'axios';
import React,{useState} from 'react';

 async function getProfile(id){



    const body={
            'discordID' : id,

      };

    axios.post('https:cop4331-squadup.herokuapp.com/api/viewProfile',body)
    .then(function(response){
         //Alert.alert("success", JSON.stringify(response,null,2))
         global.data =  response.data;
    })
    .catch(function(error) {
        Alert.alert("error",JSON.stringify(error,null,2))
    })
}





export default getProfile;

