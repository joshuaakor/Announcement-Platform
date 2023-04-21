const jwt = require('jsonwebtoken');

import {User} from "../model/userDetail.js";

const auth = async (req, res, next) => {
  try{
    //ectract token from authorization header
    const token = req.header('Authorization').replace('Bearer', '');

    //verify token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find the user in its database by its id and token
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

    //throw error if user not found 
    if(!user){
      throw new Error();
    }

    // Set the user object and token on the request object for use by later middleware
    req.user = user;
    req.token = token;

    next();
  } catch(error){
    res.status(401).send({error: 'Please Authenticate.'});
  }
};

//middleware for authorizing an admin user
const adminAuth = async(req, res, next) => {
  try{
    
    //wait for user authentication
    await auth(req, res, next);

    //check if authenticated user is an admin 
    if(req.user.userType !== 'admin') {
      throw new Error();
    }
    next();
  }catch(error) {
    res.status(403).send({error: 'You are not authorized to perform this action'});
  }
};

exports.auth = auth;
exports.adminAuth = adminAuth;