import routes from 'express';
const router = routes.Router();

import './models/modelDB'
import { user, event, todo, expense, userEvent, session } from './controllers/index'

router.get('/health', (_req, res) => {
    res.send({ health: 'Server runnning!! =)'})
})

// User
router.post('/register', user.newUser)
router.get('/user/:userid', user.getUser)
router.patch('/user/:userid', user.updateUser)
router.delete('/user/:userid', user.deleteUser)
router.get('/users/:eventid', user.getAllUsers)

// Event
router.post('/newevent', event.newEvent)
router.get('/event/:eventid', event.getEvent)
router.patch('/event/:eventid', event.updateEvent)
router.delete('/event/:eventid', event.deleteEvent)
router.get('/events/:userid', event.getUserEvents)

// Todo
router.post('/todo', todo.newToDo)
router.patch('/todo/:todoid', todo.updateToDo)
router.delete('/todo/:todoid', todo.deleteToDo)
router.get('/todos/:eventid', todo.getToDos)

// Expense
router.post('/expense', expense.newExpense)
router.delete('/expense/:expenseid', expense.deleteExpense)
router.get('/expenses/:eventid', expense.getExpenses)

// User events
router.post('/useractivity', userEvent.joinEvent)
router.delete('/useractivity', userEvent.leaveEvent)

// Session
router.post('/userlogin', session.logIn);
router.get('/userlogout', session.logOut);

export default router;