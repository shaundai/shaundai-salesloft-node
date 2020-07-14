require("dotenv").config();

const express = require('express');
const axios = require('axios');
const router = express.Router();

const salesloftApi = require('../salesloftApi');
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;


const redirectUri = 'http://https://shaundai-salesloft-node.herokuapp.com/salesloft:3001/accounts';

router.get('/', function(req, res) {
    const code = req.query.code
    const context = req.query.context
    const scope = req.query.scope
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
    }).then((response) => {
        let accessToken = response.data.access_token
        const refreshToken = response.data.refresh_token
        res.send('hi')
    }).catch(err => err)
});


module.exports = router;