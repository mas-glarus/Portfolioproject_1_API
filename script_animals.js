const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const goBack = document.querySelector("#goBack");
const animalTypeOf = sessionStorage.getItem("animal");
let animalLocation = "";
const locationNY = document.querySelector("#NY");
const locationLA = document.querySelector("#LA");
const locationTX = document.querySelector("#TX");

goBack.addEventListener("click", () => {
	location.href = "./index.html";
});

function onClickHandlerNY() {
	animalLocation = "NY";
	location.href = "./index_animals_located.html";
	sessionStorage.setItem("location", animalLocation);
}

locationNY.addEventListener("click", onClickHandlerNY);

function onClickHandlerLA() {
	animalLocation = "LA";
	location.href = "./index_animals_located.html";
	sessionStorage.setItem("location", animalLocation);
}

locationLA.addEventListener("click", onClickHandlerLA);

function onClickHandlerTX() {
	animalLocation = "TX";
	location.href = "./index_animals_located.html";
	sessionStorage.setItem("location", animalLocation);
}

locationTX.addEventListener("click", onClickHandlerTX);

function getAnimals(animalType) {
	fetch("https://api.petfinder.com/v2/oauth2/token", {
		method: "POST",
		body:
			"grant_type=client_credentials&client_id=" +
			apiKey +
			"&client_secret=" +
			apiSecret,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	})
		.then(function (resp) {
			// Return the response as JSON
			return resp.json();
		})
		.then(function (data) {
			// Log the API data
			// console.log("token", data);

			// Return a second API call
			// This one uses the token we received for authentication
			return fetch("https://api.petfinder.com/v2/animals?type=" + animalType, {
				headers: {
					Authorization: data.token_type + " " + data.access_token,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});
		})
		.then(function (resp) {
			// Return the API response as JSON
			return resp.json();
		})
		.then(function (data) {
			// Log the pet data
			console.log("pets", data);
			//remove old list items
			animalList.innerHTML = "";
			//for loop over animals array:
			for (let i = 0; i < data.animals.length; i++) {
				let listElement = document.createElement("li");
				listElement.innerHTML = data.animals[i].name;
				animalList.appendChild(listElement);
			}
		})
		.catch(function (err) {
			// Log any errors
			console.log("something went wrong", err);
		});
}

getAnimals(animalTypeOf);
