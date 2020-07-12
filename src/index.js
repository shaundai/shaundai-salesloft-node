require("dotenv").config();
const port = process.env.PORT || 3001;
const salesloftApiKey = process.env.SALESLOFT_API_KEY;
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;
const redirectUri = 'https://shaundai-salesloft-node.herokuapp.com/salesloft';
const salesloftApi = require('./salesloftApi');

const express = require('express');
const app = express();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getNewAccessToken } = require("./salesloftApi");

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
                getNewAccessToken(refreshToken).then((response) => {
                    res.json(response.data)
                })
            }
        })
    })
}
)