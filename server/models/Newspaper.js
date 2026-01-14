const mongoose = require('mongoose');

const newspaperSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
        },
        pdfUrl: {
            type: String,
            required: [true, 'Please add a PDF URL'],
        },
        coverImageUrl: {
            type: String,
        },
        totalPages: {
            type: Number,
        },
        mappedAreas: [
            {
                pageNumber: {
                    type: Number,
                    required: true,
                },
                coordinates: {
                    x: { type: Number, required: true }, // percentage
                    y: { type: Number, required: true }, // percentage
                    width: { type: Number, required: true }, // percentage
                    height: { type: Number, required: true }, // percentage
                },
                headline: {
                    type: String,
                    required: true,
                    maxlength: 150,
                },
                category: {
                    type: String,
                    enum: ['politics', 'sports', 'business', 'entertainment', 'local', 'other'],
                    default: 'other'
                },
                extractedImageUrl: {
                    type: String,
                },
            },
        ],
        isPublished: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Newspaper = mongoose.model('Newspaper', newspaperSchema);

module.exports = Newspaper;
