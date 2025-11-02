/**
 * Name: Avery Killian
 * Date: 10.30.2025
 * CSC 372-01
 *
 * Database queries for Jokebook categories and jokes.
 */

"use strict";

const pool = require('./db');

// Get all categories
async function getCategories() {
    const queryText = "SELECT name FROM categories ORDER BY name";
    const result = await pool.query(queryText);
    return result.rows.map(r => r.name);
}

// Get jokes by category (optional limit)
async function getJokesByCategory(category, limit) {
    const catRes = await pool.query("SELECT id FROM categories WHERE name=$1", [category]);
    if (catRes.rows.length === 0) return null; // invalid category
    const categoryId = catRes.rows[0].id;

    let queryText = "SELECT setup, delivery FROM jokes WHERE category_id=$1";
    const values = [categoryId];

    if (limit) {
        queryText += " LIMIT $2";
        values.push(limit);
    }

    const result = await pool.query(queryText, values);
    return result.rows;
}

// Get one random joke
async function getRandomJoke() {
    const queryText = `
        SELECT c.name AS category, j.setup, j.delivery
        FROM jokes j
        JOIN categories c ON j.category_id = c.id
        ORDER BY RANDOM()
        LIMIT 1
    `;
    const result = await pool.query(queryText);
    return result.rows[0];
}

// Add a joke
async function addJoke(category, setup, delivery) {
    // Ensure category exists
    let catRes = await pool.query("SELECT id FROM categories WHERE name=$1", [category]);
    let categoryId;

    if (catRes.rows.length === 0) {
        const insertCat = await pool.query("INSERT INTO categories (name) VALUES ($1) RETURNING id", [category]);
        categoryId = insertCat.rows[0].id;
    } else {
        categoryId = catRes.rows[0].id;
    }

    // Insert joke
    await pool.query(
        "INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3)",
        [categoryId, setup, delivery]
    );

    // Return updated jokes for category
    const updated = await pool.query("SELECT setup, delivery FROM jokes WHERE category_id=$1", [categoryId]);
    return updated.rows;
}

module.exports = { getCategories, getJokesByCategory, getRandomJoke, addJoke };
