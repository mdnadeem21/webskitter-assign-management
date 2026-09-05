const express = require("express")
const TaskController = require('../controller/task.controller')
const { authenticateToken, authorizePermission } = require('../middleware/auth.permission.check')


const router = express.Router();

router.post('/create/task',authenticateToken,authorizePermission(['create:task']),TaskController.createTask)
router.put('/update/task/:taskId',authenticateToken,authorizePermission(['update:task']),TaskController.updateTask)
router.get('/get/all/tasks',authenticateToken,authorizePermission(['view:tasks']),TaskController.getAllTasks)
router.get('/get/task/:taskId',authenticateToken,authorizePermission(['view:tasks']),TaskController.getTaskById)
router.put('/delete/task/:taskId',authenticateToken,authorizePermission(['delete:task']),TaskController.deleteTask)

// TODO:
// router.put('/search/task',TaskController.searchTasks)



module.exports = router