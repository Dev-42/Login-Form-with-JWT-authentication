const express = require('express')
const path = require('path')

// custom modules created by me :)
const {connection} = require('./db/conn')
const {UserModel} = require('./model/User.model')

const app = express()
app.use(express.json())
app.use('/' , express.static(path.join(__dirname,'static')))

app.post('/api/register' , async(req,res) => {

    console.log(req.body)
    res.json({status : 'ok'})
})

app.listen(8000, async() => {
    try{
        await connection
        console.log("Database connection successful")
    }catch(e){
        console.log(e)
        console.log("Database connection unsuccessful")
    }
    console.log("Server started successfully")
})