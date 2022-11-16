const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//MiddleWare
function checksExistsUserAccount(req, res, next) {
  const {username} = req.headers
  const user = users.find(user => user.username === username)
  if(!user){
    return res.status(404).json({error: 'Mensagem do erro'})
  }

    req.user = user

    return next()
}

app.post('/users', (req, res) => {
  const {name, username} = req.body

  const user = { 
    id: uuidv4(), 
    name: name, 
    username: username,
    todos: []
  }

  users.push(user)
  res.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const {user} = req

  return res.status(200).json(user.todos)
  
});

app.post('/todos', checksExistsUserAccount,(req, res) => {
  const {user} = req
  const {title, deadline} = req.body

  const todo = { 
    id: uuidv4(),
    title: title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  
  user.todos.push(todo)
 
  return res.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  
  const {user} = req
  const {id} = req.params
  const {title, deadline} = req.body

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id) // Caso nao encontre o id, ele retorn -1
  if (!indexOfTodo){
    return res.status(404).json({error: 'Mensagem do erro'})
  }

  const newTodo = user.todos[indexOfTodo]

  title ? newTodo.title = title : false 
  deadline ? newTodo.deadline = deadline : false
  
  return res.status(204).json(newTodo)

  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const {user} = req
  const {id} = req.params

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id)

  if(!indexOfTodo){
    return res.status(404).json({error: 'Mensagem do erro'})
  }

  user.todos[indexOfTodo].done = true
  console.log(user.todos[indexOfTodo].done)

  return res.status(204).json({done: user.todos[indexOfTodo].done})
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  const {user} = req
  const {id} = req.params

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id)

  if(!indexOfTodo){
    return res.status(404).json({error: 'Mensagem do erro'})
  }

  user.todos.splice(indexOfTodo, 1)
  res.status(204).json({done: user.todos})
});

module.exports = app;