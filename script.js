const mainApi = "https://pokeapi.co/api/v2/pokemon";
let previousApi;
let nextApi;
let currentApi;
let targetPokemon;
function pokes() {
  if (document.getElementById("start")) {
    document.getElementById("start").remove();
  }
  console.log("pokes runs");
  let pokeNames;
  let spritesArray;
  //giving some css to container + h1
  let container = document.getElementById("container");
  container.className = "container";
  document.body.className += "body";
  if (!document.getElementById("title")) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<h1 id="title">Api project</h1><br>`
    );
  }
  // fetch("https://pokeapi.co/api/v2/pokemon")
  if (!currentApi) {
    currentApi = mainApi;
  }
  fetch(currentApi)
    .then((res) => {
      if (res) {
        console.log("Success");
        return res.json();
      } else {
        console.log("Failure");
      }
    })
    .then((data) => {
      pokeNames = data.results.map((name) => name.name);
      previousApi = data.previous;
      let gotBody = document.getElementById("pokeList");
      gotBody.innerHTML = pokeNames
        .map((name) => `<p class="pokemonName">  ${name} </p>`)
        .join("");
      //arrays of APIs to pass in promiseall
      let arrForFetch = pokeNames.map((elem) =>
        fetch(" https://pokeapi.co/api/v2/pokemon/" + `${elem}`)
      );

      //multiple APis fetching
      Promise.all(arrForFetch)
        .then((jsonData) => {
          if (!document.getElementById("pokePics")) {
            document
              .getElementById("smallContainer")
              .insertAdjacentHTML("beforeend", `<div id="pokePics" ></div>`);
          }
          // creating array to convert each of the data entries to JSON format
          let JsonConversionArray = jsonData.map((data) => data.json());
          // Using Promise.all similar to previous implementation.
          Promise.all(JsonConversionArray).then((data) => {
            //collecting url with sprites to an array
            spritesArray = data.map(
              (pokemon) => pokemon.sprites["front_default"]
            );
            //maping array as img to div for pokemon pics
            document.getElementById("pokePics").innerHTML = data
              .map(
                (pokemon) =>
                  `<img src=${pokemon.sprites["front_default"]} alt="Pokemon image" class="pokemonImage"> </img>`
              )
              .join("");
            navigationButtons();
            if (!document.getElementById("searchPokemonDiv")) {
              searchPokemon();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
//start with button
document.getElementById("start").addEventListener("click",pokes);
// pokes();

function navigationButtons() {
  //if there are no navigation button creating them
  if (
    !document.getElementById("previousButton") &&
    !document.getElementById("nextButton")
  ) {
    let container = document.getElementById("container");
    container.insertAdjacentHTML(
      "beforeend",
      `<div id="previousButtonDiv"></div>`
    );
    container.insertAdjacentHTML("beforeend", `<div id="nextButtonDiv"></div>`);
    document
      .getElementById("previousButtonDiv")
      .insertAdjacentHTML(
        "afterbegin",
        `<button class="navButton" id="previousButton">Previous</button>`
      );
    document
      .getElementById("nextButtonDiv")
      .insertAdjacentHTML(
        "afterbegin",
        `<button class="navButton" id="nextButton">Next</button>`
      );
  }
  //if previous page is the last make it disabled
  let gotPreviousButton = document.getElementById("previousButton");
  if (!previousApi) {
    gotPreviousButton.classList.add("disabled");
  } else gotPreviousButton.classList.remove("disabled");
  //add eventlisteners to the button to navigate through pages
  let nextbutton = document
    .getElementById("nextButton")
    .addEventListener("click", nextPageGo);
  let previousbutton = document
    .getElementById("previousButton")
    .addEventListener("click", previousPageGo);
}
//take current api adress make fetch set next api as current and rpevious as previous
function nextPageGo() {
  fetch(currentApi)
    .then((res) => {
      if (res) {
        console.log("Success");
        return res.json();
      } else {
        console.log("Failure");
      }
    })
    .then((data) => {
      previousApi = data.previous;
      currentApi = data.next;
      pokes();
    });
}
function previousPageGo() {
  fetch(currentApi)
    .then((res) => {
      if (res) {
        console.log("Success");
        return res.json();
      } else {
        console.log("Failure");
      }
    })
    .then((data) => {
      currentApi = data.previous;
      previousApi = data.previous;
      navigationButtons();
      pokes();
    });
}
function searchPokemon() {
  let container = document.getElementById("container");
  container.insertAdjacentHTML(
    "beforeend",
    `<div id="searchPokemonDiv"> </div>`
  );
  let gotSearchPokemonDiv = document.getElementById("searchPokemonDiv");
  gotSearchPokemonDiv.innerHTML = `<form >
  <p>
    <label class="text">Search your pokemon</label><br>
    </p>
     <p>
    <label class="text">First name</label><br>
    <input id="pokemonNameByUser" type="text" name="name">
    </p>
      <p>
    <button type="button" onclick="showPokemonSearchResult()" id="pokemonSearchButton">Search</button>
  </p>
  </form>
  <div id="divForPokemonSearchResult">
  
  </div>
  `;
  // document.getElementById("pokemonSearchButton").addEventListener("click",  showPokemonSearchResult);
}
function showPokemonSearchResult() {
  let enteredPokemonName = document
    .getElementById("pokemonNameByUser")
    .value.toLowerCase();
  targetPokemon = `https://pokeapi.co/api/v2/pokemon/${enteredPokemonName}`;
  console.log("target pokemon", targetPokemon);

  fetch(targetPokemon)
    .then((res) => {
      if (res) {
        console.log("Success");
        // console.log("res.json",res.json());
        return res.json();
      } else {
        console.log("Failure");
      }
    })
    .then((data) => {
      let gotDivForPokemonSearchResult = document.getElementById(
        "divForPokemonSearchResult"
      );
      gotDivForPokemonSearchResult.innerHTML = `
        <h2>  ${data.name}</h2><br>
        <img src=${data.sprites["front_default"]}></img>
        <img src=${data.sprites["back_default"]}></img>
        <p class="text2">Weight: ${data.weight}</p>
        <p class="text2">Heigth: ${data.height}</p>
        <p class="text2">Base experience: ${data["base_experience"]}</p>
        `;
      console.log(data.id);
    });
}
