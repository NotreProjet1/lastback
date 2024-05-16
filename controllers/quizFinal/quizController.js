const Quiz = require('../../models/quizFinal/quizFinal');
const question = require('../../models/quizFinal/questionfinal');
const reponse = require('../../models/quizFinal/reponsefinal');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { authenticateToken } = require('../../middleware/authMiddleware');
const createQuiz = async (req, res) => { 
  try {
      const { titre, description } = req.body;

      const id_instructeur = req.user.id; // Récupérez l'ID de l'instructeur à partir du token 
              
      // Vérifiez si tous les champs requis sont présents 
      if (!titre || !description ) {
          return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
      }
   
      const QuizData = { titre, description};
      
      // Insérer la Quiz dans la base de données
      const insertedId = await Quiz.createQuiz(QuizData, id_instructeur);
      res.status(201).json({ 
          success: true, 
          message: `Quiz créé avec succès. ID du quiz : ${insertedId}`,
          id_q: insertedId, // Ajouter l'ID du quiz à la réponse
      }); 
  } catch (error) {
      console.error('Erreur lors de la création de la Quiz :', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
};

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.getAllQuizzes();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Erreur lors de la récupération des quiz :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des quiz' });
    }
};


  const getQuizById = async (req, res) => {
    try {
        const { id_q } = req.params;
        console.log(id_q) ; 
        const QuizData = await Quiz.getQuizById(id_q);
        if (QuizData) {
            res.status(200).json({ success: true, Quiz: QuizData });
        } else {
            res.status(404).json({ success: false, message: 'quiz non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz par ID:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du quiz.' });
    }
};
  

const getLastQuizId = async (req, res) => {
  try {
      const result = await query(`
          SELECT id_q
          FROM quiz
          ORDER BY id_q DESC   
          LIMIT 1
      `);

      // Vérifier si une formation a été trouvée
      if (result.length === 0) {
          return res.status(404).json({ success: false, message: "Aucune formation trouvée." });
      }

      // Récupérer l'ID de la dernière formation
      const lastQuizId = result[0].id_q;

      return res.status(200).json({ success: true, lastQuizId });
  } catch (err) {
      return errorHandler(res, err); 
  }
};

const getQuizWithQuestionsAndAnswers = async (req, res) => {
    try {
        const { id_Q } = req.params;

        // Récupérer le quiz
        const quiz = await Quiz.getQuizById(id_Q);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found.' });
        }

        // Récupérer les questions pour ce quiz
        const questions = await question.getQuestionsByQuizId(id_Q); 

        // Pour chaque question, récupérer les réponses
        const questionsWithAnswers = [];
        for (const question of questions) {  
            const reponses = await reponse.getReponsesByQuestionId(question.id_question);
            questionsWithAnswers.push({ question, reponses });
        }

        res.json({ success: true, quiz, questionsWithAnswers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getAllQuizzesWithInstructor = async (req, res) => {
    try {
        const queryText = `
            SELECT q.id_q, q.titre, q.description, u.nom, u.prenom
            FROM quizfinal q
            INNER JOIN users u ON q.id_instructeur = u.id
        `;
        const quizzes = await query(queryText);
        
        if (!quizzes || quizzes.length === 0) { 
            return res.status(404).json({ success: false, message: 'Aucun quiz trouvé avec instructeur.' }); 
        }

        res.status(200).json({ success: true, quizzes });
    } catch (error) {
        console.error('Erreur lors de la récupération des quiz avec instructeurs :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des quiz avec instructeurs.' });
    }
};
const getAllQuizzesDetails = async (req, res) => {
    try {
        // Récupérer tous les quizzes depuis la base de données
        const quizzes = await Quiz.getAllQuizzes();
        
        // Formatter la réponse pour inclure seulement les ID, titres et descriptions
        const quizzesDetails = quizzes.map(quiz => ({
            id: quiz.id_q,
            titre: quiz.titre,
            description: quiz.description
        }));

        // Renvoyer les détails des quizzes
        res.status(200).json({ success: true, quizzes: quizzesDetails });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails des quizzes :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des détails des quizzes.' });
    }
};


  // Exporter les fonctions du contrôleur
  module.exports = {
    createQuiz,
    getAllQuizzes  ,getQuizById ,getLastQuizId , getQuizWithQuestionsAndAnswers , getAllQuizzesWithInstructor , getAllQuizzesDetails
  };
