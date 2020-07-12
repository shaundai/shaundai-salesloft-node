module.exports = {
    getAccessToken,
    getUserInformation,
    getNewAccessToken,
};

require("dotenv").config();
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;
const redirectUri = 'https://shaundai-salesloft.surge.sh/app'
const axios = require('axios');



function getAccessToken(code, context, scope) {
    return axios({
        method: 'post',
        url: `https://accounts.salesloft.com/oauth/token`,
        params: {
        "client_id": salesloftClientId,
        "client_secret": salesloftSecret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirectUri,
        "context": context,
        "scope": scope
        },
    })
}

function getUserInformation (accessToken, refreshToken) {
    return axios({
        method: 'get',
        url: `https://api.salesloft.com/v2/me.json`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((err) => {
        if (err.response.status === 401) {
            getNewAccessToken(refreshToken);
        }}).then((response) => {
            getUserInformation(response.access_token, response.refresh_token)
        })
}

function getNewAccessToken(refreshToken) {
    return axios({
        method: 'post',
        url: `https://accounts.salesloft.com/oauth/token`,
        params: {
            "client_id": salesloftClientId,
            "client_secret": salesloftSecret,
            "grant_type": "refresh_token",
            "refresh_token": refreshToken,
            },
    }).then((response) => {
        res.redirect('https://shaundai-salesloft.surge.sh/app')
    })
}

