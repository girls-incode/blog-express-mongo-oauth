import express from 'express';
import { useAuth } from '../middleware/auth.js';
import Story from '../models/Story.js';
import objectId from '../helpers/objectId.js';
const router = express.Router();

router.get('/add', useAuth, (req, res) => {
    res.render('stories/add')
});

router.get('/:id', useAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate('user')
            .lean();

        if (!story) {
            return res.render('error/404')
        }
        return res.render('stories/show', { story })
    } catch (error) {
        res.render('error/404')
    }
});

router.post('/', useAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard')
    } catch (error) {
        res.render('error/500')
    }
});

router.get('/', useAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();
        
        res.render('stories/index',  {stories})
    } catch (error) {
        res.render('error/500')
    }
});

router.get('/edit/:id', useAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();
        if (!story) res.render('error/404');

        if (story.user.toString() !== req.user._id.toString()) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit',{story})
        }
    } catch (error) {
        res.render('error/500')
    }
});

router.put('/:id', useAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();
        
        if (!story) res.render('error/404');

        if (story.user.toString() !== req.user._id.toString()) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify:false
                }
            );
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(error);
        res.render('error/500')
    }
});

router.delete('/:id', useAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id });
        res.redirect('/dashboard')
    } catch (error) {
        res.render('error/500')
    }
});

router.get('/user/:id', useAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.id,
            status: 'public'
        })
        .populate('user')
        .lean();
       
        return res.render('stories/index', { stories })
    } catch (error) {
        res.render('error/404')
    }
});

export default router;