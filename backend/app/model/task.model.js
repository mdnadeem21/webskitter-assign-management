const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    assignedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'manage-assign-user'
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'manage-assign-user'
    },
    status:{
        type:String,
        enum:['Pending','In Progress','Completed'],
        default:'Pending'
    },
    priority:{
        type:String,
        enum:['Low','Medium','High','Urgent'],
        default:'Medium'
    },
    dueDate:{
        type:Date
    }

},{
    timestamps:true
})
const Task = mongoose.model('manage-assign-task',TaskSchema);
module.exports = Task;