import express from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post(
  '/',
  
  asyncHandler(async (req, res) => {
    const { name, email,password,username } = req.body;
    console.log(name, email,password,username);
    // console.log(email_id,password);
    console.log('i got it');
    const { data: signup, error: signupError } = await supabase
      .from('users')
      .insert({name:name,email_id:email,password:password,username:username}).select();

      // console.log(signup);

    if (signupError || !signup) {
      return res.status(400).json({
        status: 'error',
        message: 'Details were not proper',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Login Successful'
    });
  })
);

export default router;