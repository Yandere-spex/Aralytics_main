const Alphabet = require('../models/Alphabet.js');

/**
 * CONTROLLER — The brain that handles what happens for each request.
 * Analogy: Think of a restaurant. The ROUTE is the waiter who takes your order.
 * The CONTROLLER is the chef who actually cooks the food.
 * The MODEL is the recipe book the chef follows.
 * The waiter doesn't cook — they just pass the order to the chef.
 */

// @desc    Get all alphabet letters
// @route   GET /api/alphabet
// @access  Public
const getAllLetters = async (req, res) => {
    try {
        const letters = await Alphabet.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: letters.length,
            data: letters,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single letter by letter character (e.g. /api/alphabet/A)
// @route   GET /api/alphabet/:letter
// @access  Public
const getLetterByChar = async (req, res) => {
    try {
        const letter = await Alphabet.findOne({
            letter: req.params.letter.toUpperCase(),
            isActive: true,
        });

        if (!letter) {
            return res.status(404).json({ success: false, message: 'Letter not found' });
        }

        // Increment view count every time the letter is fetched
        letter.statistics.viewCount += 1;
        letter.statistics.lastViewed = new Date();
        await letter.save();

        res.status(200).json({ success: true, data: letter });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new letter
// @route   POST /api/alphabet
// @access  Private (admin)
const createLetter = async (req, res) => {
    try {
        const letter = await Alphabet.create(req.body);
        res.status(201).json({ success: true, data: letter });
    } catch (error) {
        // Handle duplicate letter
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Letter already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a letter
// @route   PUT /api/alphabet/:letter
// @access  Private (admin)
const updateLetter = async (req, res) => {
    try {
        const letter = await Alphabet.findOneAndUpdate(
            { letter: req.params.letter.toUpperCase() },
            req.body,
            { new: true, runValidators: true } // new: true returns the updated doc
        );

        if (!letter) {
            return res.status(404).json({ success: false, message: 'Letter not found' });
        }

        res.status(200).json({ success: true, data: letter });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a letter (soft delete — just sets isActive to false)
// @route   DELETE /api/alphabet/:letter
// @access  Private (admin)
const deleteLetter = async (req, res) => {
    try {
        const letter = await Alphabet.findOneAndUpdate(
            { letter: req.params.letter.toUpperCase() },
            { isActive: false },
            { new: true }
        );

        if (!letter) {
            return res.status(404).json({ success: false, message: 'Letter not found' });
        }

        res.status(200).json({ success: true, message: `Letter ${letter.letter} deactivated` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Increment play count when sound is played
// @route   PATCH /api/alphabet/:letter/play
// @access  Public
const incrementPlayCount = async (req, res) => {
    try {
        const letter = await Alphabet.findOneAndUpdate(
            { letter: req.params.letter.toUpperCase() },
            { $inc: { 'statistics.playCount': 1 } },
            { new: true }
        );

        if (!letter) {
            return res.status(404).json({ success: false, message: 'Letter not found' });
        }

        res.status(200).json({ success: true, data: letter.statistics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllLetters,
    getLetterByChar,
    createLetter,
    updateLetter,
    deleteLetter,
    incrementPlayCount,
};