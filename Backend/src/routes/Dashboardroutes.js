const express                                   = require('express');
const router                                    = express.Router();
const { getDashboard, getQuizAnalytics }        = require('../controllers/Dashboardcontroller');
const { protect }                               = require('../middlewares/authMiddleware');
 
// existing — untouched
router.get('/',                protect, getDashboard);
 
// new — Animal Knowledge tab analytics
router.get('/quiz-analytics',  protect, getQuizAnalytics);
 
module.exports = router;