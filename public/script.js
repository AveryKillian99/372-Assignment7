/**
 * Name: Avery Killian
 * Date: 10.30.2025
 * CSC 372-01
 *
 * Handles frontend logic for Jokebook project: fetching random jokes, categories,
 * jokes by category, and adding new jokes using the backend API.
 */

document.addEventListener("DOMContentLoaded", () => {
    const randomJokeContainer = document.getElementById("random-joke-container");
    const refreshRandomButton = document.getElementById("refresh-random-joke");
    const categoriesContainer = document.getElementById("categories-container");
    const categorySearchInput = document.getElementById("category-search-input");
    const searchCategoryButton = document.getElementById("search-category-button");
    const categoryJokesContainer = document.getElementById("category-jokes-container");
    const addJokeForm = document.getElementById("add-joke-form");
    const addJokeFeedback = document.getElementById("add-joke-feedback");

    /**
     * Displays a single joke in a container
     * @param {HTMLElement} container - The container to display the joke
     * @param {Object} joke - Joke object with setup and delivery
     */
    function displayJoke(container, joke) {
        container.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `<strong>${joke.setup}</strong><br>${joke.delivery}`;
        container.appendChild(div);
    }

    /**
     * Fetches and displays a random joke
     */
    async function loadRandomJoke() {
        try {
            const res = await fetch("/jokebook/random");
            const joke = await res.json();
            displayJoke(randomJokeContainer, joke);
        } catch (err) {
            randomJokeContainer.textContent = "Failed to load random joke.";
            console.error(err);
        }
    }

    /**
     * Fetches and displays all categories
     */
    async function loadCategories() {
        try {
            const res = await fetch("/jokebook/categories");
            const data = await res.json();
            categoriesContainer.innerHTML = "";
            data.categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.textContent = cat;
                btn.addEventListener("click", () => loadCategoryJokes(cat));
                categoriesContainer.appendChild(btn);
            });
        } catch (err) {
            categoriesContainer.textContent = "Failed to load categories.";
            console.error(err);
        }
    }

    /**
     * Fetches and displays jokes for a specific category
     * @param {string} category - Category name
     */
    async function loadCategoryJokes(category) {
        try {
            const res = await fetch(`/jokebook/category/${category}`);
            if (!res.ok) {
                categoryJokesContainer.textContent = "Category not found.";
                return;
            }
            const data = await res.json();
            categoryJokesContainer.innerHTML = "";
            data.jokes.forEach(joke => {
                const div = document.createElement("div");
                div.innerHTML = `<strong>${joke.setup}</strong><br>${joke.delivery}<hr>`;
                categoryJokesContainer.appendChild(div);
            });
        } catch (err) {
            categoryJokesContainer.textContent = "Failed to load jokes for category.";
            console.error(err);
        }
    }

    // Search button event
    searchCategoryButton.addEventListener("click", () => {
        const category = categorySearchInput.value.trim();
        if (category) loadCategoryJokes(category);
    });

    // Add joke form submission
    addJokeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(addJokeForm);
        const payload = {
            category: formData.get("category"),
            setup: formData.get("setup"),
            delivery: formData.get("delivery")
        };

        try {
            const res = await fetch("/jokebook/joke/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                addJokeFeedback.textContent = "Joke added successfully!";
                loadCategoryJokes(payload.category);
                addJokeForm.reset();
            } else {
                addJokeFeedback.textContent = "Failed to add joke.";
            }
        } catch (err) {
            addJokeFeedback.textContent = "Error adding joke.";
            console.error(err);
        }
    });

    // Initial load
    loadRandomJoke();
    loadCategories();
    refreshRandomButton.addEventListener("click", loadRandomJoke);
});
