require("dotenv").config();
const port = process.env.PORT || 3001;
const salesloftApiKey = process.env.SALESLOFT_API_KEY;
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;
const cors = require("cors");

const salesloftApi = require('./salesloftApi');
const accounts = require('./routes/accounts')

const express = require('express');
const path = require("path");
const app = express();
const router = express.Router();
const axios = require('axios');


app.get('/', (req, res) => {
   res.sendFile(__dirname + '../public/App.js')
})
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

app.use('/accounts', accounts);

app.get('/login', (req, res) => {
        res.redirect(`https://accounts.salesloft.com/oauth/authorize?client_id=${salesloftClientId}&redirect_uri=https://shaundai-salesloft-node.herokuapp.com/salesloft&response_type=code`) 
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
            res.json(response.data.data)
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
                    res.json(response.data.data)
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


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})