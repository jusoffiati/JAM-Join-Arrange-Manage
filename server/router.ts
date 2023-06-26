import routes from 'express';
import './models/modelDB'
const router = routes.Router();

import { user, event, todo, expense } from './controllers/index'

// User
router.post('/register', user.postUser)
router.get('/user/:id', user.getUserInfo)
router.patch('/user/:id', user.editUser)
router.delete('/user/:id', user.deleteUser)
router.get('/users/:eventid', user.getAllUsers)

// Event
router.post('/newevent', event.newEvent)
router.get('/event/:id', event.getEvent)
router.patch('/event/:id', event.updateEvent)
router.delete('/event/:id', event.deleteEvent)
router.get('/events/:userid', event.getUserEvents)

// Todo
router.post('/todo', todo.postToDo)
router.patch('/todo/:id', todo.getToDO)
router.delete('/todo/:id', todo.deleteToDO)
router.get('/todos/:eventid', todo.updateToDo)

// Expense
router.post('/expense', expense.newExpense)
router.delete('/expense/:id', expense.deleteExpense)
router.get('/expenses/:eventid', expense.getExpenses)

// Else
router.get('/*', () => { console.log('URL not found') })

export default router;