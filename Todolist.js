//TODO list using express and simple array
const express = require('express');
const app = express();
const Joi = require('joi');
const { json } = require('express');

app.use(express.json());

const todolist = [{
        id: 1,
        title: 'To learn express'
    },
    {
        id: 2,
        title: 'To show code to abiral'
    }
];

//GET REQUEST HANDLER FOR ALL THE TODO
app.get('/api/todolist', (req, res) => {
    res.send(todolist);
});

//GET REQUEST HANDLER FOR PARTICULAR TODO 
app.get('/api/todolist/:id', (req, res) => {
    let todo = todolist.find(i =>
        i.id === parseInt(req.params.id));
    if(!todo) res.status(403).send('INVALID todo id');
    res.send(todo);

});

//POST REQUEST HANDLER
app.post('/api/todolist', (req,res)=>{
    //input validation
    const schema= Joi.object({
        title:Joi.string().min(3).required()
        });

    const result = schema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0]);
        return;
    };

    //check if the todo exist or not
    const todo = {
        id:todolist.length+1,
        title:req.body.title
    }
    todolist.push(todo);
    res.send(todo);
    }
);

//PUT REQUEST HANDLER
app.put('/api/todolist/:id', (req, res) => {
  
    //check if todo exist or not
    const todo = todolist.find(i =>
        i.id === parseInt(req.params.id));
    if (!todo) res.status(403).send('INVALID todo id');

   

    //validate input from user if it is according to schema or not
    validateInput(res,req);


    //update the todo
    todo.title = req.body.title;
    res.send(todo);
});

//DELETE REQUEST HANDLER
app.delete('/api/todolist/:id',(req,res) => {
    //first get the todo and if doesn't exist return 404
    const todo = todolist.find(c=> c.id === parseInt(req.params.id));
    if(!todo) return res.status(404).send('Not Found');
    
    //delete the todo
    const index = todolist.indexOf(todo);
    const deleted = JSON.stringify(todolist.splice(index,1));
    console.log(deleted);
    res.send(`Deleted object ${deleted}`);
});

//This is the function to perform input validation used in post and put multiple times
function validateInput(res,req) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };
}

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`port open at ${port}...`));

