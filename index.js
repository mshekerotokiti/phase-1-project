
// https://www.themealdb.com/api.php

//assigning variables for DOM elements
const searchInput = document.querySelector("#search-input"),
  submitForm = document.querySelector("#submit-form"),
  randomBtn = document.querySelector("#random-btn"),
  mealsEl = document.querySelector("#meals"),
  resultHeadingEl = document.querySelector("#result-heading"),
  single_mealEl = document.querySelector("#single-meal");
containerEl = document.querySelector("#container");

//seach for meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = "";

  //get search term
  const searchTerm = searchInput.value;

  //check for null input
  if (searchTerm.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then((res) => res.json())
      .then((mealData) => {
        //adding the heading with the Search Term included
        resultHeadingEl.innerHTML = `<h3>Search results for "${searchTerm}": </h3>`;

        //check to see if any meals with searchTerm
        if (mealData.meals === null) {
          resultHeadingEl.innerHTML = `<p>That search yielded no results. Please try again!</p>`;
        } else {
          mealsEl.innerHTML = mealData.meals
            .map(
              (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}
            </h3>
            </div>
            </div>
            `
            )
            //taking the array and turning into a string
            .join("");
        }
      });
  } else {
    //create div to contain error message
    let errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.innerHTML = "<p>Please enter search terms</p>";
    containerEl.appendChild(errorDiv);
    setTimeout(clearErrorMessage, 5000);
  }
}

//remove error message
function clearErrorMessage() {
    //use vanilla JS to select item 
    let errorMessage = document.querySelector(".error-message");
    //remove from HTML
    errorMessage.remove();
}

//fetch meal by ID
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((recipeData) => {
      const meal = recipeData.meals[0];
      addMealToDOM(meal);
    });
}

//fetch random meal from API
function getRandomMeal() {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((randomData) => {
      const meal = randomData.meals[0];
      addMealToDOM(meal);
    });
}

//add recipe to DOM
function addMealToDOM(meal) {
  //empty array to hold ingredients
  const ingredients = [];

  //iterate over list of returned ingredients and measurement
  for (let i = 1; i <= 10; i++) {
    if (meal[`strIngredient${i}`]) {
      //add ingreadient and measurement to the end of the ingredients array
      ingredients.push(
        `${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`
      );
      //if there is no ingredient/measurement
    } else {
      break;
    }
  }

  //adding inner HTML to display the image, directions, and ingredients
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info"> 
         ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
         ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
         <p>${meal.strInstructions}</p>
    <h3>Ingredients</h2>
         <ul>
            ${ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
        </ul>
    </div>
  </div>
  `;
}

//add event listeners
submitForm.addEventListener("submit", searchMeal);
randomBtn.addEventListener("click", getRandomMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      //meal-info dynamically added
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  //if there is the class meal-info then use the mealid dynamically added
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});