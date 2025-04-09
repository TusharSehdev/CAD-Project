"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const models_1 = require("../models");
// Get all categories
const getCategories = (req, res) => {
    try {
        res.status(200).json(models_1.categories);
    }
    catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Error getting categories' });
    }
};
exports.getCategories = getCategories;
