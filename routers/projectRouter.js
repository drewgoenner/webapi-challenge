const express = require('express');
const Projects = require('../data/helpers/projectModel.js');

const router = express.Router();

router.use(express.json());

//get all projects
router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            res.status(500).json({error: "Couldn't retrieve list of projects from the server"});
        })
});

//get one project by id
router.get('/:id', validatProjectId, (req, res) => {
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
router.get('/:id/actions', validatProjectId, (req, res) => {
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
router.post('/', validateProject, (req, res) => {
    const project = req.body;

    Projects.insert(project)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: "Could not post new project to server"})
        })
})


//custom middleware
function validatProjectId(req, res, next) {
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
}

module.exports = router;