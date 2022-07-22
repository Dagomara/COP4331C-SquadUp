import React from "react";
import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
     LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
    serverRoot = HEROKU_ROOT_SERVER;
}
else {
    serverRoot = LOCALHOST_ROOT_SERVER;
}
const clientId = CLIENT_ID;


function LoginButton() {
    const redirectUrl = "https://discord.com/oauth2/authorize?response_type=code&redirect_uri="+serverRoot+"/auth/callback&scope=identify%20guilds%20guilds.join&client_id="+clientId;

    // const doLogin = () => {
    //     console.log(redirectUrl);
    //     window.location.href = redirectUrl;
    // };
    return (
        <div>
            <button >
                <a href={redirectUrl}>Log in With Discord</a> 
            </button>
        </div>
    );
}

export default LoginButton;