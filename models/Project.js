const mongoose=require('mongoose');
const schema=mongoose.Schema;

const prjojectSchema=new schema({
    projectId:{
        type:String,
        unique:true,
    },
    employeeId:{
        type:String
    },
    task:{
        type:String,
        default:""
    },
    deadline:{
        type:Number,
    },
    status:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('Project',prjojectSchema)