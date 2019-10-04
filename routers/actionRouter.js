const express = require('express');
const Actions = require('../data/helpers/actionModel.js');

const router = express.Router();

//get all actions for a project
router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            //if statement is a bit extra and not part of base MVP, trying to post message if the array is empty
            if(!actions) {
                res.status(200).json({ message: "This project has no actions"});
            } else {
            res.status(200).json(actions);
            }
        })
        .catch(err => {
            res.status(500).json({error: "Could not retrieve list of actions from server"});
        })
});

router.get('/:id', validateActionId, (req, res) => {
    const id = req.params.id;

    Actions.get(id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not retrieve action from server"});
        })
});





//custom middleware
function validateActionId(req, res, next) {
    const id = req.params.id;

    Actions.get()
        .then(action => {
            if(action) {
                res.action = action;
                next();
            } else {
                res.status(400).json({ message: "Invalid action ID"})
            }
        })
}



module.exports = router;