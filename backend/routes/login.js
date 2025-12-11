import express from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post(
  '/',
  
  asyncHandler(async (req, res) => {
    const { email_id,password } = req.body;
    console.log(email_id,password);

    const { data: login, error: loginError } = await supabase
      .from('users')
      .select('*')
      .eq('email_id', email_id)
      .single();

      console.log(login);

    if (loginError || !login) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found. Please provide a valid password',
      });
    }

    if(password!=login.password){
        return res.status(400).json({
        status: 'error',
        message: 'Wrong Pasword. Please provide a valid password',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Login Successful',
      login:login
    });
  })
);

export default router;