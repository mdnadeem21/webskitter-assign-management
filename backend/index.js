require('dotenv').config()
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 
const express = require('express');
const app = express();
const connectDB=require('./app/config/db.config');
const cookieParser=require('cookie-parser');
const cors=require('cors');

//connect to database
connectDB();

//cors
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}))

app.use(cookieParser())

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('Hello from Express app!');
});

//Routes
const userRoute=require('./app/route/user.route');
const taskRoute=require('./app/route/task.router')
app.use('/api/auth/v1',userRoute); 
app.use('/api',taskRoute); 

const PORT = process.env.PORT || 5000;
app.listen(PORT,(error)=>{
    if(error){
        console.log(`Error in PORT Listening : ${error.message}`);
    }else{
        console.log("server is running on port ",`http://localhost:${PORT}`);
    }
})