const API = require("./lib/API");
const readlineSync = require("readline-sync");
const newBike = { manufacturer: "", reviews: [], id: "" };

function calculateAverageRating(bike) {
  let total = 0;
  for (const review of bike.reviews) {
    total += parseInt(review.rating);
  }
  return total / bike.reviews.length;
}

function displayBicyclesSummary(bicycles) {
  for (const bike of bicycles) {
    // if ths bike has some reviews
    if (bike.reviews.length > 0) {
      console.log(
        `--- ${bike.id}: ${bike.manufacturer}, rating: ${calculateAverageRating(
          bike
        )}`
      );
    } else {
      console.log(`--- ${bike.id}: ${bike.manufacturer}, no reviews yet!`);
    }
  }
}

function displayBikeDetails(bike) {
  console.log(`-- ${bike.manufacturer} --`);
  for (const review of bike.reviews) {
    console.log(`${review.content} - Rating: ${review.rating}`);
  }
}

function chooseABike(bicycles) {
  // display each ID and manufacturer
  for (const bike of bicycles) {
    console.log(`--- ${bike.id}: ${bike.manufacturer}`);
  }

  // user inputs an ID number
  const bikeChoice = readlineSync.question(
    "Which number bike would you like to review? "
  );
  const bike = API.read("bicycles", bikeChoice);

  // if the API can't find that bike
  // run chooseABike again
  if (bike !== undefined) {
    return bike;
  } else {
    console.log("Ooops we can't find that bike!");
    return chooseABike(bicycles);
  }
}

function mainMenu() {
  console.log("----------------");
  console.log("----Best bike review app----");
  console.log("----------------");
  console.log("1. View cool bikes");
  console.log("2. Leave a review");
  console.log("3. Add a new bike");
  console.log("4. Remove a bike");

  const choice = readlineSync.question("Please choose an option ");

  if (choice === "1") {
    console.log("-----------------");
    console.log("- ALL OUR BICYCLES -");
    console.log("-----------------");

    // get all bicycles
    const bicycles = API.read("bicycles");
    displayBicyclesSummary(bicycles);

    // return to main menu
    mainMenu();
  } else if (choice === "2") {
    console.log("-----------------");
    console.log("- CHOOSE A BIKE -");
    console.log("-----------------");

    const bicycles = API.read("bicycles");
    const bike = chooseABike(bicycles);
    displayBikeDetails(bike);

    // Input review details
    const rating = readlineSync.question("What is your rating? ");
    const content = readlineSync.question("Please write your review ");

    // add the new review to the bike reviews
    bike.reviews.push({
      rating: rating,
      content: content,
    });

    // update the bike in the API
    API.update("bicycles", bike);

    console.log("----------------------------");
    console.log("Thank you for reviewing a bike!");
    console.log("----------------------------");

    // return to main manu
    mainMenu();

    /// add a bike
  } else if (choice === "3") {
    function addNewBike(bicycles) {
      console.log("-----------------");
      console.log("- ENTER NEW BIKE -");
      console.log("-----------------");

      const newManufacturer = readlineSync.question(
        `What is the name of the bike manufacturer?`
      );
      newBike.manufacturer = newManufacturer;

      API.create("bicycles", newBike);

      console.log("----------------------------");
      console.log("Thank you for adding a bike!");
      console.log("----------------------------");

      mainMenu();
    }

    addNewBike();

    /// remove a bike
  } else if (choice === "4") {
    function removeABike() {
      console.log("-----------------");
      console.log("- DELETE A BIKE -");
      console.log("-----------------");
  
      /// display all bikes again for user to pick one for destruction
      const bikes = API.read("bicycles");
      displayBicyclesSummary(bikes);
  
      const removeBikeID = readlineSync.question("Which bike do you want to remove? ");
      
      API.destroy("bicycles", Number(removeBikeID));
  
      console.log("----------------------------");
      console.log("Thank you for removing a bike!");
      console.log("----------------------------");
        
      mainMenu();
      }
      removeABike();
  } else {
    console.log("Sorry, can you choose something else?");
    mainMenu();
  }
}

mainMenu();
