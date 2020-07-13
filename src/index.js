require("dotenv").config();
const port = process.env.PORT || 3001;
const salesloftApiKey = process.env.SALESLOFT_API_KEY;
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;
const redirectUri = 'https://shaundai-salesloft.surge.sh/app';
const salesloftApi = require('./salesloftApi');

const express = require('express');
const app = express();
const axios = require('axios');

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

app.get('/', (req, res) => {
   res.send('main app')
})

//gets info about me or authenticated user
app.get('/salesloft', (req, res) => {
    const code = req.query.code
    const context = req.query.context
    const scope = req.query.scope
    salesloftApi.getAccessToken(code, context, scope).then((response) => {
        let accessToken = response.data.access_token
        const refreshToken = response.data.refresh_token
        axios({
            method: 'get',
            url: `https://api.salesloft.com/v2/me.json`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            res.json(response.data)
        }).catch((err) => {
            if (err.response.status === 401) {
                axios({
                    method: 'post',
                    url: `https://api.salesloft.com/v2/me.json`,
                    params: {
                        "client_id": salesloftClientId,
                        "client_secret": salesloftSecret,
                        "grant_type": "refresh_token",
                        "refresh_token": refreshToken,
                        },
                }).then((response) => {
                    res.json(response.data)
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    })
}
)

const getRefreshToken = (refreshToken) => {
    return axios({
            method: 'post',
            url: `https://accounts.salesloft.com/oauth/token`,
            params: {
            "client_id": salesloftClientId,
            "client_secret": salesloftSecret,
            "grant_type": "refresh_token",
            "refresh_token": refreshToken
            },
        }).then((response) => {
            const accessToken = response.data.access_token
            return accessToken;
        })
        .catch((err) => {
            res.status(404).send(err)
        })
    
}