/**
 * Name: Avery Killian
 * Date: 10.30.2025
 * CSC 372-01
 *
 * Handles API logic for Jokebook endpoints.
 */

"use strict";

const model = require('../models/jokebookModel');

// GET /jokebook/categories
async function fetchCategories(req, res) {
    try {
        const categories = await model.getCategories();
        res.json({ categories });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

// GET /jokebook/category/:category
async function fetchJokesByCategory(req, res) {
    const category = req.params.category;
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    try {
        const jokes = await model.getJokesByCategory(category, limit);
        if (!jokes) return res.status(404).send("Category not found");
        res.json({ jokes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

// GET /jokebook/random
async function fetchRandomJoke(req, res) {
    try {
        const joke = await model.getRandomJoke();
        res.json(joke);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

// POST /jokebook/joke/add
async function createJoke(req, res) {
    const { category, setup, delivery } = req.body;
    if (!category || !setup || !delivery) {
        return res.status(400).send("Missing required fields");
    }

    try {
        const updatedJokes = await model.addJoke(category, setup, delivery);
        res.status(201).json({ jokes: updatedJokes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

module.exports = { fetchCategories, fetchJokesByCategory, fetchRandomJoke, createJoke };
