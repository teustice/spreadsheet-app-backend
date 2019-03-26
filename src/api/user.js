let express = require('express')
let router = express.Router()
let auth = require('./auth');
const passport = require('passport');

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
