import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connect } from 'mongoose';
import { connectDB } from './config/db.js';
import courseRouter from './routes/courseRoute.js';
import bookingRouter from './routes/bookingRouter.js';


const app=express()
const port=4000;


//MIDDLEWARE
app.use(cors({ origin:['http://localhost:5174','http://localhost:5173'],
    credentials:true,
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(clerkMiddleware())

app.use('/uploads',express.static('uploads'));

// DB
connectDB();

// ROUTES
app.use('/api/course',courseRouter)
app.use('/api/booking',bookingRouter);


//APP PORT AND LISTEN
app.get('/',(req,res)=>{
    res.send('API WORKING')
});

app.listen(port,(req,res)=>{
    console.log(`server started on http://localhost:${port}`);
})