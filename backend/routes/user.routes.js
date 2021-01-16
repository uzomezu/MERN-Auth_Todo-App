require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const gravatar = require('gravatar');
const validateLoginInput = require('../validation/login');
const validateRegisterInput = require('../validation/register');

const User = require('../models/User');

router.post('/register', async (req, res)=>{
   const {errors, isValid} = validateRegisterInput(req.body);
   if(!isValid){
      return res.status(400).json(errors);
   }
   await User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                res.status(400).json({email: "Email already exists"})
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                });

                bcrypt.genSalt(10, (err, salt)=>{
                    if(err) console.log(`There was an error: ${err}`)
                    else {
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                }); 
                        }
                       });
                    }
                });
            }
        });
});

router.post('/login', async (req, res)=>{
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
})

router.get('/me', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    return res.json({
        // id: req.user._id,
        // name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    })
})

module.exports = router;