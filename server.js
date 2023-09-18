const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const JWT_SECRET = "dev's-secret"

// custom modules created by me :)
const {connection} = require('./db/conn')
const {UserModel} = require('./model/User.model')

const app = express()
app.use(express.json())
app.use('/' , express.static(path.join(__dirname,'static')))
// app.use('/' , express.static(path.join(__dirname,'static/login.html')))
app.use(bodyParser.json())

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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
  });

// Handling login request
// Handling login request
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.send({ status: 'error', error: 'Invalid username/password' }); // Return the response here
    }

    const correct_login = bcrypt.compareSync(password, user.password);

    if (correct_login) {
        // Provide the user with a JWT
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET);
        return res.send({ status: 'ok', data: token }); // Return the response here
    } else {
        // Display unsuccessful message
        return res.send({ status: 'error', error: 'Invalid token' }); // Return the response here
    }
});

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