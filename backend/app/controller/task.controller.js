const Task = require('../model/task.model')
const User = require('../model/user.model')

const ALLOWED_STATUSES = ['pending','in-Progress','completed']
const ALLOWED_PRIORITIES = ['low','medium','high','urgent']

class TaskController{
    async createTask(req,res){
        try{
            const { title, description, assignTo, status='pending', priority='medium', dueDate } = req.body || {}

            // Basic validations
            if(!title || typeof title !== 'string' || !title.trim()){
                return res.status(400).json({ message: 'Title is required and must be a non-empty string' })
            }

            if(!assignTo){
                return res.status(400).json({ message: 'assignTo (user id) is required' })
            }

            if(status && !ALLOWED_STATUSES.includes(status)){
                return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
            }

            if(priority && !ALLOWED_PRIORITIES.includes(priority)){
                return res.status(400).json({ message: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(', ')}` })
            }

            let due = undefined
            if(dueDate){
                due = new Date(dueDate)
                if(Number.isNaN(due.getTime())){
                    return res.status(400).json({ message: 'dueDate must be a valid date' })
                }
            }

            // assignBy comes from authenticated user (assumes middleware sets req.user)
            const assignBy = req.user && (req.user._id || req.user.id)
            if(!assignBy){
                return res.status(401).json({ message: 'Unauthorized: assignBy (logged in user) is required' })
            }

            // verify assignTo exists
            const assignedUser = await User.findById(assignTo).select('_id')
            if(!assignedUser){
                return res.status(404).json({ message: 'assignTo user not found' })
            }

            const taskPayload = {
                title: title.trim(),
                description: description || '',
                assignBy,
                assignTo: assignedUser._id,
                status,
                priority,
            }
            if(due) taskPayload.dueDate = due

            const task = new Task(taskPayload)
            await task.save()

            return res.status(201).json({ message: 'Task created', task })
        }catch(err){
            console.error('createTask error:', err)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
    async updateTask(req,res){
        try{
            const { taskId } = req.params
            const { title, description, assignTo, status, priority, dueDate } = req.body || {}

            // Validate taskId
            if(!taskId){
                return res.status(400).json({ message: 'taskId is required' })
            }

            // Check if task exists
            const task = await Task.findById(taskId)
            if(!task){
                return res.status(404).json({ message: 'Task not found' })
            }

            // Get current user role
            const userRole = req.user && req.user.role
            if(!userRole){
                return res.status(401).json({ message: 'Unauthorized: User role is required' })
            }

            // If user role is 'user', only allow status and priority updates
            if(userRole === 'user'){
                // Validate status if provided
                if(status !== undefined && !ALLOWED_STATUSES.includes(status)){
                    return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
                }

                // Validate priority if provided
                if(priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)){
                    return res.status(400).json({ message: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(', ')}` })
                }

                // Only allow status and priority updates
                if(status !== undefined) task.status = status
                if(priority !== undefined) task.priority = priority

                // Reject any other field updates
                if(title !== undefined || description !== undefined || assignTo !== undefined || dueDate !== undefined){
                    return res.status(403).json({ message: 'Users can only update status and priority' })
                }
            }else{
                // Non-user roles can edit everything
                // Validate title if provided
                if(title !== undefined){
                    if(typeof title !== 'string' || !title.trim()){
                        return res.status(400).json({ message: 'Title must be a non-empty string' })
                    }
                    task.title = title.trim()
                }

                // Update description if provided
                if(description !== undefined){
                    task.description = description
                }

                // Validate and update assignTo if provided
                if(assignTo !== undefined){
                    const assignedUser = await User.findById(assignTo).select('_id')
                    if(!assignedUser){
                        return res.status(404).json({ message: 'assignTo user not found' })
                    }
                    task.assignTo = assignedUser._id
                }

                // Validate status if provided
                if(status !== undefined){
                    if(!ALLOWED_STATUSES.includes(status)){
                        return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
                    }
                    task.status = status
                }

                // Validate priority if provided
                if(priority !== undefined){
                    if(!ALLOWED_PRIORITIES.includes(priority)){
                        return res.status(400).json({ message: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(', ')}` })
                    }
                    task.priority = priority
                }

                // Validate and update dueDate if provided
                if(dueDate !== undefined){
                    const due = new Date(dueDate)
                    if(Number.isNaN(due.getTime())){
                        return res.status(400).json({ message: 'dueDate must be a valid date' })
                    }
                    task.dueDate = due
                }
            }

            await task.save()
            return res.status(200).json({ message: 'Task updated', task })
        }catch(err){
            console.error('updateTask error:', err)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    // TODO: need small modification in search
    async searchTasks(req,res){
        try{
            const {
                status,
                priority,
                assignTo,
                assignBy,
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query || {}

            const currentUserId = req.user && (req.user._id || req.user.id)
            const currentUserRole = req.user && req.user.role

            const query = { isDeleted: { $ne: true } }

            if(status){
                if(!ALLOWED_STATUSES.includes(status)){
                    return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` })
                }
                query.status = status
            }

            if(priority){
                if(!ALLOWED_PRIORITIES.includes(priority)){
                    return res.status(400).json({ message: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(', ')}` })
                }
                query.priority = priority
            }

            if(assignTo){
                query.assignTo = assignTo
            }

            if(assignBy){
                query.assignBy = assignBy
            }

            if(currentUserRole === 'user' && currentUserId){
                query.$or = [
                    { assignTo: currentUserId },
                    { assignBy: currentUserId }
                ]
            }

            const pageNumber = Math.max(1, Number(page) || 1)
            const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10))
            const sortDirection = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1

            const [tasks, total] = await Promise.all([
                Task.find(query)
                    .sort({ [sortBy]: sortDirection })
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber)
                    .populate('assignTo', 'name email')
                    .populate('assignBy', 'name email')
                    .lean(),
                Task.countDocuments(query)
            ])

            return res.status(200).json({
                message: 'Tasks fetched successfully',
                tasks,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    pages: Math.ceil(total / limitNumber)
                }
            })
        }catch(err){
            console.error('getAllTasks error:', err)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    async getAllTasks(req,res){
        try {
                const tasks = await Task.find({
                isDeleted: false
                })

                if(!tasks){
                    res.status(400).json({
                        success: false,
                        message: "task not found"
                        });
                }
                res.status(200).json({
                success: true,
                total_tasks: tasks.length,
                tasks: tasks
                });

        } catch (error) {
            console.error('Error in getting all users:', error.message);
            return res.status(500).json({ status: false, message: 'Internal server error in get all users' });
        }
    }

    async getTaskById(req,res){
        try{
            const { taskId } = req.params || {}

            if(!taskId){
                return res.status(400).json({ message: 'taskId is required' })
            }

            const currentUserId = req.user && (req.user._id || req.user.id)
            const currentUserRole = req.user && req.user.role

            const task = await Task.findOne({ _id: taskId, isDeleted: { $ne: true } })
                .populate('assignTo', 'name email')
                .populate('assignBy', 'name email')
                .lean()

            if(!task){
                return res.status(404).json({ message: 'Task not found' })
            }

            if(currentUserRole === 'user' && currentUserId){
                const isAssignedToUser = task.assignTo && task.assignTo._id
                    ? task.assignTo._id.toString() === currentUserId.toString()
                    : task.assignTo && task.assignTo.toString() === currentUserId.toString()

                const isAssignedByUser = task.assignBy && task.assignBy._id
                    ? task.assignBy._id.toString() === currentUserId.toString()
                    : task.assignBy && task.assignBy.toString() === currentUserId.toString()

                if(!isAssignedToUser && !isAssignedByUser){
                    return res.status(403).json({ message: 'Forbidden: you do not have access to this task' })
                }
            }

            return res.status(200).json({ message: 'Task fetched successfully', task })
        }catch(err){
            console.error('getTaskById error:', err)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    async deleteTask(req,res){
        try{
            const { taskId } = req.params || {}

            if(!taskId){
                return res.status(400).json({ message: 'taskId is required' })
            }

            const task = await Task.findById(taskId)
            if(!task){
                return res.status(404).json({ message: 'Task not found' })
            }

            const userId = req.user && (req.user._id || req.user.id)
            const userRole = req.user && req.user.role
            if(!userId){
                return res.status(401).json({ message: 'Unauthorized: user is required' })
            }

            // Allow deletion only to admins or the user who assigned the task
            const isOwner = task.assignBy && task.assignBy.toString() === userId.toString()
            if(userRole !== 'admin' && !isOwner){
                return res.status(403).json({ message: 'Forbidden: you do not have permission to delete this task' })
            }

           
            task.isDeleted = true
            await task.save()

            return res.status(200).json({ message: 'Task deleted' })
        }catch(err){
            console.error('deleteTaske error:', err)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    
}

module.exports = new TaskController();