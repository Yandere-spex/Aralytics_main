const express = require('express');
const router = express.Router();
const {
    getAllLetters,
    getLetterByChar,
    createLetter,
    updateLetter,
    deleteLetter,
    incrementPlayCount,
} = require('../controllers/AlphabetController');

/**
 * ROUTES — The address map of your API.
 * Analogy: Routes are like a city's street signs.
 * They tell incoming traffic (HTTP requests) where to go.
 * The controller is the destination building — the route just points you there.
 *
 * The router itself knows nothing about the logic — it just maps:
 * METHOD + URL PATH → controller function
 */

router.route('/')
    .get(getAllLetters)      // GET  /api/alphabet
    .post(createLetter);    // POST /api/alphabet

router.route('/:letter')
    .get(getLetterByChar)   // GET    /api/alphabet/A
    .put(updateLetter)      // PUT    /api/alphabet/A
    .delete(deleteLetter);  // DELETE /api/alphabet/A

router.patch('/:letter/play', incrementPlayCount); // PATCH /api/alphabet/A/play

module.exports = router;