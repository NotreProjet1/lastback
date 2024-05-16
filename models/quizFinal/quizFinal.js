const db = require('../../config/db');
const util = require('util');
const Question = require('../quizFinal/questionfinal'); // Importez la bonne classe
const query = util.promisify(db.query).bind(db);

const createQuiz = async (quizData, id_instructeur) => {
    try {
        const { titre, description } = quizData;
        
        const insertQuery = `
            INSERT INTO quizfinal (titre, description, id_instructeur)
            VALUES (?, ?, ?)
        `;
        const result = await db.query(insertQuery, [titre, description, id_instructeur]);

        return result.insertId;
    } catch (error) {
        throw error;
    }
};

const getAllQuizzes = async () => {
    try {
        const queryText = 'SELECT * FROM quizfinal';
        const results = await query(queryText);
        return results;
    } catch (error) {
        throw error; 
    }
};


const getQuizById = async (id_q) => {
    try {
        const queryText = 'SELECT * FROM quizfinal WHERE id_q = ?';
        const results = await query(queryText, [id_q]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};

const getLastQuizId = async () => {
    try {
        const queryText = 'SELECT id_q FROM quizfinal ORDER BY id_q DESC LIMIT 1';
        const result = await query(queryText);
        if (result.length === 0) {
            throw new Error("Aucun quiz trouvé.");
        }
        return result[0].id_q;
    } catch (error) {
        throw error;
    }
};

const getAllQuizzesWithQuestionsAndAnswers = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Question.getQuizById(id);

        if (!quiz) { 
            return res.status(404).json({ success: false, message: 'Quiz not found.' }); 
        }

        const questions = await Question.getQuestionsByQuizId(id);

        const questionsWithAnswers = [];
        for (const question of questions) {
            const answers = await Question.getReponsesByQuestionId(question.id_question);
            questionsWithAnswers.push({ question, answers });
        }

        res.status(200).json({ success: true, quiz, questionsWithAnswers });
    } catch (error) {
        console.error('Error getting questions and answers for quiz:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


module.exports = {
    createQuiz, 
    getAllQuizzes,
    getQuizById, 
    getLastQuizId,
    getAllQuizzesWithQuestionsAndAnswers
};
