//Here is the API's im calling upon

const randomDrinkAPI = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const searchAPI = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const detailsDrinkAPI = (drinkId) => `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`; //googled how to solve this, since it gave me error messages about drinkId 


//THese are all the elements, the different pages and the navbar
const navbar = document.querySelector(".navbar");
const startPage = document.querySelector("#startPage");
const detailsPage = document.querySelector("#detailsPage");
const searchPage = document.querySelector("#searchPage"); 

//Elements for button to generate random drink + name + image

const generateDrinkBtn = document.getElementById("generateDrinkBtn");
const drinkName = document.getElementById("drinkName");
const drinkImage = document.getElementById("drinkImage");
const seeMoreBtn = document.getElementById("seeMoreBtn");

//Search form elements

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchLink = document.getElementById("searchLink");
const startLink = document.getElementById("startLink");

//Details elements

const detailsDrinkName = document.getElementById("detailsDrinkName");
const detailsDrinkImage = document.getElementById("detailsDrinkImage");
const detailsIngredients = document.getElementById("detailsIngredients");
const detailsInstructions = document.getElementById("detailsInstructions");
const detailsGlass = document.getElementById("detailsGlass");
const detailsTags = document.getElementById("detailsTags");
const detailsCategory = document.getElementById("detailsCategory");
const backToStartBtn = document.getElementById("backToStartBtn");


//THis is the eventListener for the click on Home or Search in the navbar

navbar.addEventListener("click", handleOnNavbarClick); 


//This function enables me to go to another page as soon as a click is heard
//on i.e. Search or Start in navbar, got help from niklas for it on 12/10 lesson

function handleOnNavbarClick(event){ 
    const id = event.target.id;

    //if the link is clicked I return this ID and open this page with .add

    if (id === "startLink") {

        startPage.style.display = "block";
        searchPage.style.display = "none";
        detailsPage.style.display = "none";

    } else if (id === "searchLink") {

        startPage.style.display = "none";
        searchPage.style.display = "block";
        detailsPage.style.display = "none";
    }

}

//This generates a random drink by listening to click on the button
generateDrinkBtn.addEventListener("click", generateRandomDrink); 

//Trying to generate a random drink as soon as i come to the startpage

async function generateRandomDrink() { 
    try {
        const response = await fetch(randomDrinkAPI);
        const data = await response.json();
        const drink = data.drinks[0];

        drinkName.textContent = drink.strDrink; //get the drinkName and store in drink
        drinkImage.src = drink.strDrinkThumb; //and the Image
        drinkImage.alt = drink.strDrink; //and just a alt image

        seeMoreBtn.dataset.drinkId = drink.idDrink;


    } catch (error) {

        console.error("Error generating random drink:", error);
        drinkName.textContent = "Failed to load a drink!";
        drinkImage.src = ""; // Hide 
        drinkImage.alt = "Error loading image";
    }


}



async function seeMore(drinkId) {
    try {
        const response = await fetch(detailsDrinkAPI(drinkId)); // Use the function
        const data = await response.json();
        const drink = data.drinks[0];

        showDrinkDetails(drink); 

    } catch (error) {
        console.error("Error generating drink details!", error);
        detailsDrinkName.textContent = "Failed to load the drink details!";
        detailsDrinkImage.src = ""; //no image
        detailsDrinkImage.alt = "Image loading error!"; //error messages
    }
}
 

//THis makes sure that as soon as the html page has
// been loaded the random drink generator gets called upon
document.addEventListener("DOMContentLoaded", generateRandomDrink);


seeMoreBtn.addEventListener("click", () => {
    const drinkId = seeMoreBtn.dataset.drinkId;
    if (drinkId) {
    seeMore(drinkId);
    } else {
        console.error("no drink ID is available for See More button.")
    }
});

//This is the searchform event listener

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page

    const query = searchInput.value.trim(); 
    if (!query) return; 

    try {
        const response = await fetch(`${searchAPI}${query}`);
        const data = await response.json();

        searchResults.innerHTML = ""; 

        if (data.drinks) {
            displaySearchResults(data.drinks);
           
        } else {
            searchResults.innerHTML = "<p>No cocktails found. Try again please!</p>";
        }
    } catch (error) {
        console.error("Error finding search results:", error);
        searchResults.innerHTML = "<p>Failed to find search results. Please try again.</p>";
    }
});


//THis function adds event listeners on both see more 
//button but also the pictures in search result

function showDrinkDetails(drink) {

    startPage.style.display = "none"; //hide
    searchPage.style.display = "none";
    detailsPage.style.display = "block"; //show this opage
     
    detailsDrinkName.textContent = drink.strDrink;
    detailsDrinkImage.src = drink.strDrinkThumb;
    detailsDrinkImage.alt = drink.strDrink;
    detailsTags.textContent = drink.strTags ? drink.strTags : "No tags available"; // this didnt work, tried with different methods but sometimes it shows null, don't know if its because it sees the value null or if it thinks its a string "null"
    detailsGlass.textContent = drink.strGlass;
    detailsCategory.textContent = drink.strCategory ? drink.strCategory : "No category is available";


    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure || ""} ${ingredient}`.trim());
        }
    }
    detailsIngredients.textContent = `Ingredients: ${ingredients.join(", ")}`;
    detailsInstructions.textContent = `Instructions: ${drink.strInstructions}`;
    detailsGlass.textContent = `Glass to use: ${drink.strGlass}`;
    detailsTags.textContent = `Tags: ${drink.strTags}`;
    detailsCategory.textContent = `Category: ${drink.strCategory}`;


}



function displaySearchResults(drinks) {
    searchResults.innerHTML = "";  // nthis empty string clears previous results
    drinks.forEach((drink) => { //loop through "drink"

        const resultItem = document.createElement("div"); //creates a div when a drink is found
        resultItem.classList.add("searchResultsItem"); //gives the result a new class inside the new div
        resultItem.innerHTML = `
        <h3>${drink.strDrink}</h3>
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="imageStyle" style="cursor: pointer;" data-drink-id="${drink.idDrink}">
        <button class="btn seeMoreBtn" data-drink-id="${drink.idDrink}">See More</button>
    `; //here i add the see more button so I can click it, but the picture is also clickable as seen in the eventlistener
        searchResults.appendChild(resultItem); //show the info placed in resultItem on the page
    });
    

}


searchResults.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("seeMoreBtn") || target.tagName === "IMG") { //if i press the button "click" or the picture
        const drinkId = target.dataset.drinkId; // calls the right drink Id to show
        seeMore(drinkId); // call on th function to load full drink details
    }
});

backToStartBtn.addEventListener("click", () => { //eventlistener for the get back to start button
    startPage.style.display = "block"; // using the same logic as on the navbar
    searchPage.style.display = "none"; // hide
    detailsPage.style.display = "none"; // hide
    
});



