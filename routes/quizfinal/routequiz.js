const express = require('express');
const router = express.Router();
const quizController = require('../../controllers/quizFinal/quizController');
const upload = require("../../middleware/fileapp");

const { authenticateToken, generateToken } = require("../../middleware/authMiddleware");
router.post('/Add' ,authenticateToken, quizController.createQuiz);
router.get('/lister', quizController.getAllQuizzes); 
router.get('/getQuizById/:id_q', quizController.getQuizById); 
router.get('/getLastQuizId', quizController.getLastQuizId);
 
router.get('/:id_Q', quizController.getQuizWithQuestionsAndAnswers); 
router.get('/donner', quizController.getAllQuizzesWithInstructor);   
router.get('/quizzes', quizController.getAllQuizzesDetails);
module.exports = router;   
 