// url = https://www.themealdb.com/api.php 

//assigning variables to the DOM elements
const searchInput = document.querySelector("#search-input")
 const submitForm = document.querySelector("#submit-form")
 const resultHeading = document.querySelector("#result-heading")
 const recipes = document.querySelector("#meals")
 const singleMeal = document.querySelector("#single-meal")
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
        //serach URL
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then((response) => response.json()) //promise as JSON
        .then((mealData) => {                    //promise with data
            //adding the heading with the search term included
            resultHeading.textContent = `<h3>Search results for "${searchTerm}": </h3>`

            //check to find meals with search input
            if(mealData.meals === null){
                resultHeading.textContent = `<p>No results.  Please try again!</p>`;
            }
            else{
                meals.textContent = mealData.meals
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

    //clear search text
    searchInput.value = "";
    searchInput.placeHolder = "Search by keywords"
    }
    else{
        //to contain the error message
        let errorDiv = document.createElement("div");
        errorDiv.classList.add("error-message");
        errorDiv.textContent = "<p>PLease enter search terms</>"; //insert text with the meaasge
        containerEl.appendChild(errorDiv);       //append div to the container
        setTimeout(clearErrorMessage, 5000);     //interval taken to remove error messaging
    
    }

    //remove error message

}

 //fetching data from the API by ID
 function getMealById(mealId){
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
 }
