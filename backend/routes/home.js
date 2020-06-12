// This file contains router handler for the home endpoint.
const express = require('express');
const router = express.Router();

/* GET API Home. */
router.get('/', (req, res) => {
    res.send("Welcome to API Home");
});

module.exports = router;
