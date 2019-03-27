let express = require('express')
let router = express.Router()
let auth = require('./auth');
const passport = require('passport');
const nodemailer = require("nodemailer");
import async from 'async';
var crypto = require('crypto');

import Users from '../models/user';

//Get list of users for admin interaction
router.get('/', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  Users.findById(id)
      .then((user) => {
          if(!user.roles.admin) {
            console.log(user);
              res.status(400).json({errors: "Admin privilages required"});
          } else {
            Users.find(function(err, user) {
                res.send(user);
            })
          }
      })
});

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save(function (err) {
      if(err) {
        res.status(400).json({errors: {Error: err.message}});
      } else {
        res.json({ user: finalUser.toAuthJSON()})
      }
    })
});


//Update User information
router.put('/:id', auth.required, (req, res, next) => {
    Users.update({ _id: req.params.id}, req.body, function(err, user){
      if(!user){
          req.flash('error', 'No account found');
          return res.sendStatus(400);
      }
      var emailEdit = req.body.email;
      var rolesEdit = req.body.roles;
      if(emailEdit.length <= 0 || rolesEdit.length <= 0 ){
          req.flash('error', 'One or more fields are empty');
          return res.sendStatus(400);
      }
      else{
          user.email = emailEdit;
          user.roles = rolesEdit;

          return res.sendStatus(200);
      }
    })
});

//Update Password
router.post('/update-password', auth.required, (req, res, next) => {
    Users.findOne({email: req.body.email}).then(function(sanitizedUser){
    if (sanitizedUser){
      sanitizedUser.setPassword(req.body.password, function(){
        sanitizedUser.save();
        res.status(200).json({message: 'password reset successful'});
      });
    } else {
      res.status(500).json({message: 'This user does not exist'});
    }
  },function(err){
    console.error(err);
  })
});

//Reset Password
router.post('/forgot', auth.optional, (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Users.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport( {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'cbdonotreply@gmail.com', // generated ethereal user
          pass: 'HDQJjZi3ZoxgmukrmAAas(F7' // generated ethereal password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'spreadsheet@demo.com',
        subject: 'Password Reset - FB Holiday ',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' + req.headers.origin + '/reset-password/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.status(200).json('An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset-password/:token', function(req, res) {
  Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.status(422).json({errors: {error: 'User not found'}});
    }
    res.json({user: user})
  });
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user || !user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!user || !user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).json(info);
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id)
        .then((user) => {
            if(!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        })
});


module.exports = router;
