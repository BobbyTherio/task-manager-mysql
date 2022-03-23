const express = require('express');
const app = express();
const config = require('./config');
const mysql = require('mysql');
const Task = require('./Models/Task');

app.use(express.urlencoded({extended: false}));

//This is the connection to the MySQL Database
config.authenticate().then(function(){
    console.log('Database is Running and Connected...');
}).catch(function(err){
    console.log(err);
});

//Create a database connection
let connexion = mysql.createConnection({
    host: 'localhost', //location of our mysql database server
    user: 'bobby',
    password: 'password', //Same password as what we use on MySQL Workbench
    database: 'task-manager',
});

//Confirm our database connection
connexion.connect(function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log('Connected to database.');
    }
});

// GET : This get the list of all "tasks"
app.get('/', function(req, res){
    Task.findAll().then(function(result){
        res.status(200).send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

// POST : Add a new task
app.post('/', function(req, res){
    Task.create(req.body).then(function(result){
        res.redirect('/');
    }).catch(function(err){
        res.status(500).send(err);
    });
});

// DELETE : Delete a task
app.delete('/:task_id', function(req, res){
    let taskId = req.params.task_id;

    //Find the task by ID
    Task.findByPk(taskId).then(function(result){

        if(result){
            //Delete task from database
            result.destroy().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Task not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

// PATCH : Update priority level of a task
app.patch('/:task_id', function(req, res){
    let taskId = req.params.task_id;

    //Find the task 
    Task.findByPk(taskId).then(function(result){
        //Check if task was found
        if(result){
            //Update Task
            if (req.body.priority_level == null) {
                result.priority_level = result.priority_level
            } else {
                 result.priority_level = req.body.priority_level;
            }
             if (req.body.progress_level == null){
                 result.progress_level = result.progress_level
            } else {
              result.progress_level = req.body.progress_level;
            }
            //Save changes to DB
            result.save().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Task not found');
        }
    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.listen(3000, function(){
    console.log('Server running on port 3000....');
});