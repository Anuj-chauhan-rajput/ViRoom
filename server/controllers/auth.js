import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';



const generateToken =(id) =>{
    return jwt.sign({id}, "Anuj", {
        expiresIn: '30d',
    })
}

export const register = async (req, res) => {
    try {
        // Destructure body from request
        const { username, email, password } = req.body;

        // Validate input (basic example, adjust as needed)
        if (!username || !email || !password) {
            console.log("SSDSDD")
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: passwordHash
        });

        // Save the user to the database
        const user = await newUser.save();
        // Generate JWT token
        const token = generateToken(user._id);
        console.log(token)

        // Prepare user data to send in response
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        // Send the response
        res.status(200).json({ token, user: userData });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
};

export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).json({msg: "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});

        // generate jwt token using function we defined at top of the page
        const token = generateToken(user._id);
        delete user.password;
        const userData = {_id: user._id, username: user.username, email:user.email};
        res.status(200).json({token, user:userData});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};


