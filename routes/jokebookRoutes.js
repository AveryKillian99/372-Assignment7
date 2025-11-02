/**
 * Name: Avery Killian
 * Date: 10.30.2025
 * CSC 372-01
 *
 * Express router for Jokebook API endpoints.
 */

"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/jokebookController");

router.get("/categories", controller.fetchCategories);
router.get("/category/:category", controller.fetchJokesByCategory);
router.get("/random", controller.fetchRandomJoke);
router.post("/joke/add", controller.createJoke);

module.exports = router;
