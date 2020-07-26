require("dotenv").config();
const port = process.env.PORT || 3001;
const salesloftSecret = process.env.SALESLOFT_APP_SECRET;
const salesloftClientId = process.env.SALESLOFT_APP_ID;
const cors = require("cors");

const express = require('express');
const app = express();
const router = express.Router();
const axios = require('axios');
const bodyParser = require('body-parser');
const { query } = require("express");

const tokens = {}

app.get('/', (req, res) => {
   res.send('main app')
})

app.use(bodyParser.json())
app.use(cors());

//information needed over and over in app
//access and refresh tokens
app.post('/token', (req, res) => {
    tokens.accessToken = req.body.accessToken
    tokens.refreshToken = req.body.refreshToken
    res.status(200).send()
})

app.get('/tokens', (req, res) => {
    res.send(tokens)
})

//returns all info about user
app.get('/api/user', (req, res) => {
    return axios({
        method: 'get',
        url: `https://api.salesloft.com/v2/me.json`,
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((err) => {
        console.log(err)
    })
})

//returns info about all accounts owned by user
app.get('/api/accounts', (req, res) => {
    const ownerId = req.query.owner_id
    const ownerQueryString = ownerId[0].split(",")
    return axios({
        method: 'get',
        url: `https://api.salesloft.com/v2/accounts.json`,
        params: {
            sort_by: "last_contacted_at",
            per_page: "100",
            owner_id: ownerQueryString,
        },
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/api/account/:accountid', (req, res) => {
    return axios({
        method: 'get',
        url: `https://api.salesloft.com/v2/accounts.json`,
        params: {
            ids: req.params.accountid,
        },
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((err) => {
        console.log(err)
    })
})

//returns people in salesloft for a given account id
app.get('/api/accounts/people', (req, res) => {
    const accountId = req.query.account_id
    const queryString = accountId[0].split(",")
    return axios({
        method: 'get',
        url: `https://api.salesloft.com/v2/people.json`,
        params: {
            account_id: queryString
        },
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/api/cadence/:personid', (req, res) => {
    return axios({
        method: 'get',
        url: `https://api.salesloft.com/v2/cadence_memberships.json`,
        params: {
            person_id: req.params.personid,
        },
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`
        }
    }).then((response) => {
        res.json(response.data)
    }).catch((err) => {
        console.log(err)
    })
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

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})