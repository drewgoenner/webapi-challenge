const express = require('express');
const Projects = require('../data/helpers/projectModel.js');
const Actions = require('../data/helpers/actionModel.js');

const router = express.Router();

router.use(express.json());

//get all projects
router.get('/projects', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            res.status(500).json({error: "Couldn't retrieve list of projects from the server"});
        })
});

//get one project by id
router.get('/projects/:id', validateProjectId, (req, res) => {
    const id = req.params.id;

    Projects.get(id)
        .then(project => {
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: `Could not fetch project ID ${id} from the server`})
        })
});

//get actions for a specific project
router.get('/projects/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id;

    Projects.getProjectActions(id)
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not retrieve list of actions from the server"})
        })
});

//add a new project
router.post('/projects', validateProject, (req, res) => {
    const project = req.body;

    Projects.insert(project)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not post new project to server"})
        })
});

//delete a project
router.delete('/projects/:id', validateProjectId, (req, res) => {
    const id = req.params.id;

    Projects.remove(id)
        .then(removed => {
            res.send({ message: `Project ${id} has been deleted`});
        })
        .catch(err => {
            res.status(500).json({ error: `Unable to remove project ${id} from the server`});
        })
});

//update a project
router.put('/projects/:id', validateProjectId, validateProject, (req, res) => {
    const id = req.params.id;
    const update = req.body;

    Projects.update(id, update)
        .then(project => {
            res.status(201).json(update);
        })
        .catch(err => {
            res.status(500).json({ error: `Unable to update project #${id}`})
        })
});



//get all actions for a project
router.get('/actions', (req, res) => {
    
    Actions.get()
        .then(actions => {
            //if statement is a bit extra and not part of base MVP, trying to post message if the array is empty
            // if(!actions) {
            //     res.status(200).json({ message: "This project has no actions"});
            // } else {
            res.status(200).json(actions);
            // }
        })
        .catch(err => {
            res.status(500).json({error: "Could not retrieve list of actions from server"});
        })
});

//get action by its id
router.get('/actions/:id', validateActionId, (req, res) => {
    const {id} = req.params;
    

    Actions.get(id)
        .then(action => {
           
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not retrieve action from server"});
        })
});

//add new action

router.post('/projects/:project_id/actions', (req, res) => {
    const {project_id} = req.params;
    const newAction = {
        project_id: project_id,
        description: req.body.description,
        notes: req.body.notes,
        completed: req.body.completed
    }
    Projects.get(project_id)
        .then(project => {
            if(project) {
                if (newAction.description && newAction.notes) {
                    Actions.insert(newAction)
                        .then(action => {
                            console.log(action);
                            res.status(201).json({message: "New action created successfully"});
                        })
                        .catch(err => {
                            res.status(500).json({ error: "Could not add new action to server"})
                        })
                } else {
                    res.status(400).json({message: "Description and notes required"});
                }
            } else {
                res.status(404).json({message: `Project ID ${project_id} not found`});
            }
        })
    
});

//delete an action
router.delete('/projects/:project_id/actions/:id', validateActionId, (req, res) => {
    const {id} = req.params;

    Actions.remove(id)
        .then(action => {
            res.send({message: `Action #${id} has been deleted`});
        })
        .catch(err => {
            res.status(500).json({error: "Could not remove action from server"});
        })
});

//update an action
router.put('/projects/:project_id/actions/:id', validateActionId, (req, res) => {
    const {project_id, id} = req.params;
    const updateAction = {
        project_id: project_id,
        description: req.body.description,
        notes: req.body.notes,
        completed: req.body.completed
    }

        
            
    Projects.get(project_id)
        .then(project => {
            if(project) {
                if(updateAction.description && updateAction.notes) {
                    Actions.update(id, updateAction)
                        .then(newAction => {
                            console.log(newAction);
                            res.status(201).json({message: "Successfully update action"});
                        })
                        .catch(err => {
                            res.status(500).json({error: "Error updating action on server"});
                        })
                } else {
                    res.status(400).json({ message: "Description and Notes required"});
                }
            } else {
                res.status(404).json({message: `Couldn't find project with id ${project_id}`});
            }
    })
            
        
})



//custom middleware
function validateProjectId(req, res, next) {
    const id = req.params.id;

    Projects.get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(400).json({ message: `${id} is an Invalid Project ID`})
            }
        })
}

function validateProject (req, res, next) {
    const project = req.body;

    if (!Object.keys(project).length) {
        res.status(400).json({ message: "missing project info"});
    } else if (!project.name || !project.description) {
        res.status(400).json({ message: "Name and Description are required"})
    } else {
        next();
    }
};

function validateActionId(req, res, next) {
    
    const {id} = req.params;

    Actions.get(id)
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