const mongoose = require('mongoose');

const alphabetSchema = new mongoose.Schema(
    {
        letter: {
            type: String,
            required: [true, 'Letter is required'],
            uppercase: true,
            trim: true,
            maxlength: 1,
            match: [/^[A-Z]$/, 'Letter must be a single uppercase letter A-Z'],
            unique: true,
        },
        order: {
            type: Number,
            required: [true, 'Order is required'],
            min: 1,
            max: 26,
        },
        animal: {
            name: { type: String, required: [true, 'Animal name is required'] },
            scientificName: { type: String },
            description: { type: String, required: [true, 'Description is required'] },
            funFact: { type: String, required: [true, 'Fun fact is required'] },
            habitat: { type: String, required: [true, 'Habitat is required'] },
        },
        media: {
            image: {
                url: { type: String, required: [true, 'Image URL is required'] },
                alt: { type: String },
            },
            animation: {
                url: { type: String },
                type: { type: String, default: 'gif' },
            },
            video: {
                url: { type: String },
                videoId: { type: String },
                title: { type: String },
            },
            sound: {
                url: { type: String },
                duration: { type: Number },
                format: { type: String },
            },
        },
        pronunciation: {
            phonetic: { type: String, required: [true, 'Phonetic pronunciation is required'] },
            audioUrl: { type: String },
        },
        statistics: {
            viewCount: { type: Number, default: 0 },
            playCount: { type: Number, default: 0 },
            lastViewed: { type: Date, default: null },
        },
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true, // auto-manages createdAt and updatedAt
    }
);

module.exports = mongoose.model('Alphabet', alphabetSchema);
