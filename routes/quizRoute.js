const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const upload = require("../middleware/fileapp");

const { authenticateToken, generateToken } = require("../middleware/authMiddleware");
router.post('/Add',authenticateToken , quizController.createQuiz);
router.get('/lister', quizController.getAllQuizzes); 
router.get('/getQuizById/:id_q', quizController.getQuizById); 
router.get('/getLastQuizId', quizController.getLastQuizId);
module.exports = router; 
 