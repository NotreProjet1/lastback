const db = require('../../config/db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

const createQuestion = (questionData, callback) => {
    const { questions 	,id_quiz } = questionData;
    const query = 'INSERT INTO questionfinal ( questions 	,id_quiz) VALUES ( ?, ?)';
    db.query(query, [questions 	,id_quiz], (err, result) => {
      if (err) {
        callback(err, null); 
      } else {
        callback(null, result); 
      }
    });  
  }; 



const getLastQuestionId = async () => {
    const queryText = 'SELECT id_question FROM questionfinal ORDER BY id_question DESC LIMIT 1';
    const result = await query(queryText);
    return result[0]?.id_question;
};
const getQuestionsByQuizId = async (id_quiz) => {
    try {
        const queryText = 'SELECT * FROM questionfinal WHERE id_quiz = ?';
        const results = await query(queryText, [id_quiz]);
        return results;
    } catch (error) {
        throw error;
    }
};



module.exports = {
    createQuestion,
    getQuestionsByQuizId , 
    getLastQuestionId 
};
