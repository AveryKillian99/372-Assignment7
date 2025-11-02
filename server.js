/**
 * Name: Avery Killian
 * Date: 10.30.2025
 * CSC 372-01
 *
 * Main server file for the Jokebook project.
 */

"use strict";

const express = require("express");
const multer = require("multer");
const app = express();
require("dotenv").config();

// Middleware
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Import router
const jokebookRoutes = require("./routes/jokebookRoutes");

// Mount router
app.use("/jokebook", jokebookRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT + "!");
});
