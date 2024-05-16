const Quiz = require('../models/quizModel');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { authenticateToken } = require('../middleware/authMiddleware');
// const createQuiz = (req, res) => {
//     const quizData = req.body; 
//     Quiz.createQuiz(quizData, (err, result) => {
//       if (err) {
//         console.error('Erreur lors de la création du quiz :', err);
//         res.status(500).json({ error: 'Erreur lors de la création du quiz' });
//       } else {
//         res.status(201).json({ message: 'Quiz créé avec succès', quizId: result.insertId });
//       }
//     });
//   };
// Dans votre contrôleur de quiz (quizController.js) 



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





  
  // Récupérer tous les quiz
  const getAllQuizzes = (req, res) => {
    Quiz.getAllQuizzes((err, quizzes) => { 
      if (err) {
        console.error('Erreur lors de la récupération des quiz :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des quiz' });
      } else {
        res.status(200).json(quizzes);
      }
    });
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

  // Exporter les fonctions du contrôleur
  module.exports = {
    createQuiz,
    getAllQuizzes  ,getQuizById ,getLastQuizId
  };
