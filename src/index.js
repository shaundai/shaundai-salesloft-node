require("dotenv").config();
const port = process.env.PORT || 4000;
const salesloftApiKey = process.env.SALESLOFT_API_KEY;

const express = require('express');
const app = express();
const axios = require('axios');

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
