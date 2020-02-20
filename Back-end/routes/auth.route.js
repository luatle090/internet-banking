const express = require('express');
const jwt = require('jsonwebtoken');
const rndToken = require('rand-token');
const authModel = require('../models/auth.model');
const opts = require('../utils/opts');
const request = require('request');
const router = express.Router();

//
// login

router.post('/', async (req, res) => {
  // req.body = {
  // 	user: 'test',
  // 	pwd: 'test'
  // }
  if (!req.body.recaptchaToken) {
    return res.status(400).json({ message: "recaptchaToken is required" });
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "username or password are required" });
  }


  //verify google
  const verifyCaptchaOptions = {
    uri: "https://www.google.com/recaptcha/api/siteverify",
    json: true,
    form: {
      secret: opts.CAPTCHA.SECRET_KEY,
      response: req.body.recaptchaToken
    }
  };

  request.post(verifyCaptchaOptions, async (err, response, body) => {
    if (err) {
      return res.status(500).json({ message: "oops, something went wrong on our side" });
    }

    if (!body.success) {
      return res.status(520).json({ message: body["error-codes"].join(".") });
    }
    const ret = await authModel.login(req.body);
    if (ret === null) {
      return res.json({
        authenticated: false
      });
    }
    console.log(response.body);
    const payload = {
      userId: ret.id,
      username: ret.username,
      email: ret.email,
      hoTen: ret.hoTen
    }
    const token = jwt.sign(payload, opts.ACCESS_TOKEN.SECRET_KEY, {
      expiresIn:  opts.ACCESS_TOKEN.LIFETIME // 10 mins
    });
    const rfToken = rndToken.generate(opts.REFRESH_TOKEN.SIZE);
    res.status(201).json({
      // authenticated: true,
      accessToken: token,
      refreshToken: rfToken
    })
    // thêm token vào db addToken()
    // Save the user to the database. At this point they have been verified.
    // });
  }
  );
});
module.exports = router;