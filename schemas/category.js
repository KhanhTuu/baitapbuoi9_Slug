const slugify = require('slugify'); // Import slugify
const mongoose = require('mongoose');
let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return slugify(this.name, { lower: true });
        }
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('category', categorySchema);
