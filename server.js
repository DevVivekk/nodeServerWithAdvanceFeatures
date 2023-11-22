const express = require('express')
const app = express();
const dotenv = require('dotenv')
require("dotenv").config()
const axios = require("axios");
const path = require('path')
const ratelimiter = require('express-rate-limit');
const cors  = require('cors')
const Bottleneck = require('bottleneck');
const session = require('express-session');
const UserModel = require('./db');
const mysessionmiddleare = require('./middleware/middleware');
const { interceptorfile } = require('./interceptor/myinterceptor');
app.use(express.json())
app.use(cors())
app.use(interceptorfile.interceptor);
app.use(
    session({
      secret: 'jebcei2ubd84bef8',
      resave: false,
      saveUninitialized: true,
    })
  );
app.listen(4000);


// Creating a limiter with a maximum of 5 requests per minute (throttling api)
const apilimiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 10000 / 3, // 3 requests per 10 seconds
  });


// Apply rate limiting to the get /api route
const limiter = ratelimiter({
    windowsMs: 60 * 1000, // 1 minute
    max: 5, // Maximum 5 requests per minute
  });



// Throttling API
app.get("/getjson", limiter, async (req, res) => {
    try {
      const response = await apilimiter.schedule(() => axios.get('https://jsonplaceholder.typicode.com/posts'));
      res.status(200).json(response.data);
    } catch (e) {
      console.error('API request failed:', e.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.use("/api",limiter)

  //for entire app
  //app.use(limiter)


//get api with a middleware:-
app.get('/api',mysessionmiddleare,async(req,res)=>{
    console.log(interceptorfile.request);
    console.log("latest request: ", req.intercept);
    const find = await UserModel.find({})
    res.status(201).json(find)
})


//patch api to patch the data on the basis of id
app.patch('/update/:id',async(req,res)=>{
    try{
        const {name,email,username,mobile,website} = req.body;
        console.log(req.body)
        const {id} = req.params;
        const checkid = await UserModel.findById({_id:id})
        if(checkid){
            const update = await UserModel.findByIdAndUpdate({_id:id},{name,email,username,mobile,website},{new:true})
            res.status(201).json(update)
            console.log(update)
        }else{
            res.status(401).json("error")
        }
    }catch(e){
        console.log(e)
        res.status(401).json(e)
    }
})


//post api to edit the data and save it
app.post('/submit',async(req,res)=>{
    try{
        const {name,email,username,mobile,website} = req.body;
        if(!name || !email || !username || !mobile || !website){
            return res.status(401).json("No data")
        }else{
            await new UserModel({name,email,username,mobile,website}).save()
            res.status(201).json('saved')
        }
    }catch(e){
        console.log(e)
        return res.status(401).json(e)
    }
})

//delete api to delete the data on the basis of id
app.delete('/delete/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const check = await UserModel.findOne({_id:id})
        if(check){
        const del = await UserModel.findByIdAndDelete({_id:id})
        res.status(201).json("deleted!")
        }else{
            res.status(401).json("error")
        }
    }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})



//findbyId 
app.get('/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const find = await UserModel.findById({_id:id})
        res.status(201).json(find)
    }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})


//saving likes
app.put('/likes/:id',async(req,res)=>{
    try{
        const liked = {
            like:req.body.token
        }
        const {id} = req.params;
        const check = await UserModel.findById({_id:id})
        if(check){
            const save = await UserModel.findByIdAndUpdate(req.params.id,{$push:{likes:liked}},{new:true})
            console.log(save)
            res.status(201).json('sucess')
        }else{
            return res.status(401).json("error")
        }
        }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})

//unlike 
app.put('/unlikes/:id',async(req,res)=>{
    try{
        const liked = {
            like:req.body.token
        }
        const {id} = req.params;
        const check = await UserModel.findById({_id:id})
        if(check){
            const save = await UserModel.findByIdAndUpdate(req.params.id,{$pull:{likes:liked}},{new:true})
            console.log(save)
            res.status(201).json('sucess')
        }else{
            return res.status(401).json("error")
        }
        }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})