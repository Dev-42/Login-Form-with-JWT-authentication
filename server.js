const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')

// custom modules created by me :)
const {connection} = require('./db/conn')
const {UserModel} = require('./model/User.model')
const { error } = require('console')

const app = express()
app.use(express.json())
app.use('/' , express.static(path.join(__dirname,'static')))

app.post('/api/register' , async(req,res) => {
    console.log(req.body)

    const{username , password} = req.body

    if(!username || typeof username !== 'string'){
        return res.send({status : 'error' , error : 'Invalid username'})
    }

    if(!password || typeof password !== 'string'){
        return res.send({status : 'error' , error : 'Invalid Password'})
    }

    if(password.length < 5){
        return res.send({status : 'error' , error : 'Password too small. Should be atleast 6 characters'})
    }

    // Hashing password
    const pass = await bcrypt.hashSync(password,10)
    console.log(pass)
    try{
        const newUser = new UserModel({
            username,
            password : pass
        })
        const newU = await newUser.save()
        res.send({newU})
    }catch(error){
        // console.log(JSON.stringify(e))
        if(error.code === 11000){
            return res.send({status : 'error' , error : 'Username already in use'})
        }
        throw error
    }
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