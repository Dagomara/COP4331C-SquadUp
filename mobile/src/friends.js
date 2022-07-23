import {Alert,StyleSheet,View,Text,Image,Button} from 'react-native';

function Friends(){
Alert.alert("data",JSON.stringify(global.data,null,2));
    return(
        <View style = {styles.container}>

           <Text>Friends</Text>



        </View>
    );
}

 const styles = StyleSheet.create({
     container: {
       flex : 1,
       backgroundColor : "grey",
       alignItems: 'center',
       justifyContent: 'center',
     },

     logo: {
        width : 50,
        height : 50,
        alignItems: 'center',

     },




 });

 export default Friends;