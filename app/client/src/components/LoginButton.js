import React from "react";
import axios from "axios";
const port = require("../config.json").PORT;
const clientId = require("../config.json").CLIENT_ID;

function LoginButton() {
    const redirectUrl = "https://discord.com/oauth2/authorize?response_type=code&redirect_uri=http://localhost:"+port+"/auth/callback&scope=identify%20guilds%20guilds.join&client_id="+clientId;

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