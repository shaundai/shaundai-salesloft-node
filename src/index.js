require("dotenv").config();
const port = process.env.PORT || 3001;
const salesloftApiKey = process.env.SALESLOFT_API_KEY;
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;
const redirectUri = 'http://localhost:3001/salesloft'

const express = require('express');
const app = express();
const axios = require('axios');

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

app.get('/', (req, res) => {
    getAccessToken()
    .then((response) => {
        const newToken = req.query.code
        res.send('hi')
    })
    .catch((err) => {
        res.status(404).send('there was an error')
    })
})

app.get('/salesloft', (req, res) => {
    const code = req.query.code
    const context = req.query.context
    const scope = req.query.scope
    axios({
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
    }).then((response) => {
        const accessToken = response.data.access_token
        axios({
            method: 'get',
            url: `https://api.salesloft.com/v2/me.json`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            res.send(response.data)
        })
    })
    .catch((err) => {
        res.status(404).send(err)
    })

}
)

const getAccessToken = () => {
    return axios.get(`https://accounts.salesloft.com/oauth/authorize?client_id=${salesloftClientId}&redirect_uri=${redirectUri}&response_type=code`)
}
