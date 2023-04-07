// url = https://www.themealdb.com/api.php 

//assigning variables to the DOM elements
const searchInput = document.querySelector("#search-input")
 const submitForm = document.querySelector("#submit-form")
 const resultHeading = document.querySelector("#result-heading")
 const mealsEl = document.querySelector("#meals")
 const singleMeal = document.querySelector("#single-meal")
 const randomBtn = document.querySelector("#random-btn")
 const containerEl = document.querySelector("#container");

//preventing default action
function searchMeal(event){
    event.preventDefault();

    // clear meal
    singleMeal.textContent = "";

    //get search tearm
    const searchTerm = searchInput.value;

    //check for null input
    if(searchTerm.trim()){
        //search URL
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then((response) => response.json()) //promise as JSON
        .then((mealData) => {                    //promise with data
            //adding the heading with the search term included
            resultHeading.textContent = `Search results for ${searchTerm}:`

            //check to find meals with search input
            if(mealData.meals === null){
                resultHeading.textContent = `No results.  Please try again!`;
            }
            else{
                mealsEl.textContent = mealData.meals
                //include html
                .map((meal) => 
                    `<div classs= "meal>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}
                    </h3>
                    </div>
                    </div> `
                )
                //turn the array into a string
                .join("");
            }
        }
        );
    }
    else{
        //to contain the error message
        let errorDiv = document.createElement("div");
        errorDiv.classList.add("error-message");
        errorDiv.textContent = "Please enter search terms"; //insert text with the message
        containerEl.appendChild(errorDiv);       //append div to the container
        setTimeout(clearErrorMessage, 3000);     //interval taken to remove error message
    
    }

    //remove error message
function clearErrorMessage(){
    let errorMessage = document.querySelector(".error-message");
    errorMessage.remove();
}

}

 //fetching meal from the API by ID
 function getMealById(mealId){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((recipeData) => {
        const meal = recipeData.meals[0];
        addMealToDOM(meal)
    });
 }

 //fetch random meal from API
 function getRandomMeal(){
    //clear meals and heading
    mealsEl.textContent = ""
    resultHeading.textContent = ""
    
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((randomData) => {
        const meal = randomData.meals[0];
        addMealToDOM(meal)
    })
 }

 //add recipe to DOM
function addMealToDOM(meal) {
    //empty array to hold ingredients
    const ingredients = [];
  
    //for loop to go over list of returned ingredients and measurements
    //no more than twenty returned
    for (let i = 1; i <= 20; i++) {
      //logic for if there is an ingredient in the JSON
      if (meal[`strIngredient${i}`]) {
        //add ingreadient and measurement to the end of the ingredients array
        ingredients.push(
          `${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`
        );
        //logic for what to do if there is no ingredient/measurement
      } else {
        //end the function
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
//action to complete when the form is submitted
submitForm.addEventListener("submit", searchMeal);
//get random meal
randomBtn.addEventListener("click", getRandomMeal);

//get meal by id for selected meal returned from search
mealsEl.addEventListener("click", (e) => {
  //setting a variable mealinfo to see if the selected item has that class
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      //meal-info dynamically added in search meal function
      return item.classList.contains("meal-info");
      //returning false if there is no class meal-info
    } else {
      return false;
    }
  });

  //if there is the class meal-info then this is logic to use the mealid dynamically added
  //in the search meal function to get meal by ID and display image, directions, and ingredient/measurements
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});