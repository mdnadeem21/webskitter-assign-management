require('dotenv').config()
const express = require('express');
const app = express();
const connectDB=require('./app/config/db.config');
const cookieParser=require('cookie-parser');
const cors=require('cors');

//connect to database
connectDB();

//cors
app.use(cors())

app.use(cookieParser())

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello from Express app!');
});

//Routes
// const userRoutes=require('./app/route/user.router');
// const blogRoute=require('./app/route/blog.router')
// app.use('/api/auth/v1',userRoutes); 
// app.use('/api',blogRoute); 

const PORT = process.env.PORT || 5000;
app.listen(PORT,(error)=>{
    if(error){
        console.log(`Error in PORT Listening : ${error.message}`);
    }else{
        console.log("server is running on port ",`http://localhost:${PORT}`);
    }
})