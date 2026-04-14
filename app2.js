const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static('public')); // Serves your HTML file

// 1. MongoDB Connection
// Replace 'skillvault' with your database name
mongoose.connect('mongodb+srv://joshuakolawole:joshua1234@cluster0.zibsx.mongodb.net/skillvault')
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// 2. Define the Student Schema
const studentSchema = new mongoose.Schema({
    course: String,
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    country: String,
    experienceLevel: String,
    motivation: String,
    registrationDate: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'skillvault.html'))
})

// 3. The Registration Route
app.post('/submit', async (req, res) => {

    console.log(req.body)
    try {

        //for new users
        const newStudent = new Student({
            course: req.body.course,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            country: req.body.country,
            experienceLevel: req.body.experienceLevel,
            motivation: req.body.motivation
        });

        await newStudent.save();
        
        // Redirect or send success response
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #00ff9d;">Success!</h1>
                <p>Thank you, ${req.body.firstName}. Your registration is complete.</p>
                <a href="/">Go Back</a>
            </div>
        `);
      //for checking already registered member
        const oldStudent = await studentSchema.findOne({email})
                if(user){
                  return res.status(400).json({message:"user already exists", 
                        user:{ 
                            id: user._id, 
                            name: user.name,
                            email: user.email
                         } 
                       })
                }
    } catch (error) {
        res.status(500).send("Error saving to database: " + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});