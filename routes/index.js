import express from 'express';
import { useAuth, useGuest } from '../middleware/auth.js';
import Story from '../models/Story.js';
const router = express.Router();

/**
* @swagger
* /:
*  get:
*      summary: login form
*       description: show login page
*       tags:
*           - login
*       responses:
*           200:
*               description: All users were returned.
*/

router.get('/', useGuest, (req, res) => {
    res.render('login', {layout:'login'})
});

router.get('/dashboard', useAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        res.render('error/500')        
    }
});

export default router;