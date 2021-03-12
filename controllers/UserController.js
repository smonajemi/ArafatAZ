const { response } = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

const findUser = (req,res,next) => {
    User.find()
    .then(response => {
        res.json({
            response: 'User Found.'
        })
    })
    .catch(error => {
        res.json({
            message: 'Error on finding the user.'
        })
    })
}   

// display single user
const show = (req,res,next) => {
    let userId = req.body.userId;
    User.findById(userId)
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'Error on finding the user.'
        })
    })
}

// add user
const store = (req,res,next) => {
    bcrypt.hash(req.body.password, 10, function(error,hashedPass){
        if(error){
            res.json({

            })
        }
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPass
        })
        user.save()
        .then(user =>{
            res.json({
                message: 'User Added Successfully.'
            })
        })
        .catch(error => {
            res.json({
                message: 'Could not add user.'
            })
        })
    })
}

//update 
const update = (req,res,next) => {
    let userId = req.body.userId;
    let updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    }
    User.findByIdAndUpdate(userId, {$set: updateData})
    .then(() => {
        res.json({
            message: 'User updated successfully.'
        })
    })
    .catch(error => {
        res.json({
            message: 'Could not update user.'
        })
    })
}

// delete 
const remove = (req,res,next) => {
    let userId = req.body.userId;
    User.findByIdAndDelete(userId)
    .then(() => {
        res.json({
            message: 'User deleted successfully.'
        })
    })
    .catch(error => {
        res.json({
            message: 'Could not delete user.'
        })
    })
}

module.exports = {findUser,show,store,update,remove}