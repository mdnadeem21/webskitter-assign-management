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
        enum:['pending','in-Progress','completed'],
        default:'pending'
    },
    priority:{
        type:String,
        enum:['low','medium','high','urgent'],
        default:'medium'
    },
    dueDate:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})
const Task = mongoose.model('manage-assign-task',TaskSchema);
module.exports = Task;