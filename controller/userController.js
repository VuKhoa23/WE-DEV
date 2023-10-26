const User = require("../models/user");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = function(err){
    console.log(err.message, err.code);
    let errors = {username: '', email: '', password: ''};

    // incorrect username
    if(err.message === 'incorrect username'){
        errors.username = 'that username already exist';
    }

    // incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }
    
    // incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }

    // dupplicate errors
    if(err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }

    // validations errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(function({properties}){
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;    // 3 days
const createToken = function(id){
    return jwt.sign({id}, 'secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = function(req, res){
    res.render('signup');
}

module.exports.login_get = function(req, res){
    res.render('login');
}

module.exports.signup_post = async function(req, res){
    const {username, email, password} = req.body;
    try{
        const user = await User.create({username, email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user, redirect: '/'});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors}); 
    }
}

module.exports.login_post = async function(req, res){
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user, redirect: '/'});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = function(req, res){
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

