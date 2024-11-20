document.addEventListener('DOMContentLoaded', () => {
    const recipeContainer = document.getElementById('recipe-container');
    const getNewRecipesBtn = document.getElementById('get-new-recipes-btn');
    const splashScreen = document.getElementById('splash-screen');
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    // Fetch 30 random recipes
    async function fetchRandomRecipes(count = 30) {
        recipeContainer.innerHTML = '<p>Fetching recipes...</p>';
        try {
            const recipePromises = Array.from({ length: count }, () =>
                fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
            );

            const results = await Promise.all(recipePromises);
            const recipes = results.map(result => result.meals[0]);
            displayRecipes(recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            recipeContainer.innerHTML = '<p>Failed to fetch recipes. Please try again later.</p>';
        }
    }

    // Display recipes on the page
    function displayRecipes(recipes) {
        recipeContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const ingredients = [];
            for (let i = 1; i <= 5; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                if (ingredient) ingredients.push(ingredient);
            }

            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strCategory} | ${recipe.strArea}</p>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <p class="recipe-steps">${recipe.strInstructions || 'Instructions not available'}</p>
                <button onclick="window.open('${recipe.strYoutube}', '_blank')">Watch Video</button>
            `;

            recipeContainer.appendChild(recipeCard);
        });
    }

    // Fetch 30 random recipes when the page is loaded
    fetchRandomRecipes();

    // Add event listener to the "Get New Recipes" button
    if (getNewRecipesBtn) {
        getNewRecipesBtn.addEventListener('click', () => {
            fetchRandomRecipes();
        });
    }

    // Hide the splash screen and show the main content after 2 seconds
    setTimeout(() => {
        splashScreen.style.opacity = '0'; // Fade out splash screen
        setTimeout(() => {
            splashScreen.style.display = 'none'; // Hide splash screen completely
            header.style.display = 'block';
            main.style.display = 'block';
            header.style.opacity = '1';
            main.style.opacity = '1';
        }, 1000); // Wait for fade-out transition to finish
    }, 2000); // Splash screen appears for 2 seconds before fading out
});
