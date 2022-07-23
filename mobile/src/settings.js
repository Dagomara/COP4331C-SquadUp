import {StyleSheet,View,Text,Image,Button} from 'react-native';

function Settings(){

    return(
        <View style = {styles.container}>
            <Image
                style = {styles.logo}
                source = {require('./assets/Squadup_with_text_gradient_white.png')}
            />


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
        width : 150,
        height : 50,
        alignItems: 'center',
        justifyContent: 'center',
     },




 });

 export default Settings;