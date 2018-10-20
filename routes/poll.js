const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const Vote      = require('../models/Vote');
const Pusher    = require('pusher');
var   pusher    = new Pusher({
    appId: '626430',
    key: '843cc95d1ae6dadd355b',
    secret: 'ca1f5842f8a4e492d322',
    cluster: 'eu',
    encrypted: true
});

// Setup index route
router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({
        success: true,
        votes: votes
    }))
});

router.post('/', (req, res) => {

    // Save the vote to DB
    const newVote = {
        os: req.body.os,
        points: 1
    };

    Vote.create(newVote)
        .then(vote => {
            pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });
        return res.json({
            success: true,
            message: 'Thank you for voting!'
        });
    })
        .catch(err => console.error(err));
});

module.exports = router;