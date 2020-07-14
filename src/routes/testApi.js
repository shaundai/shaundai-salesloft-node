const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('API is kinda working');
});

module.exports = router;