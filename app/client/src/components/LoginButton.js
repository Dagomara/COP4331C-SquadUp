import React from "react";
const port = process.env.PORT || 3001;
const urlRoot = process.env.URL_ROOT || "http://localhost:";
const clientId = process.env.CLIENT_ID;


function LoginButton() {
    const redirectUrl = "https://discord.com/oauth2/authorize?response_type=code&redirect_uri="+urlRoot+port+"/auth/callback&scope=identify%20guilds%20guilds.join&client_id="+clientId;

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