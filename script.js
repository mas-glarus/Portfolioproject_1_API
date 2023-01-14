const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const btn = document.getElementById("btn-submit");
const output = document.getElementById("output");
const body = document.querySelector("body");
const animalList = document.getElementById("animalList");

function onClickHandler() {
	const selectedItem = document.querySelector("#animalSelection");
	const animalType = selectedItem.value;
	output.innerHTML = animalType;
	if (animalType === "empty") {
		output.classList.add("redAlert");
		output.innerHTML = "You have to choose a type";
		body.classList.remove("lightGreen");
	} else {
		console.log(animalType);
		body.classList.add("lightGreen");
		output.classList.remove("redAlert");
		getAnimals(animalType);
	}
}

btn.addEventListener("click", onClickHandler);
// const org = "RI77";
// const status = "adoptable";

// Call the API
// This is a POST request, because we need the API to generate a new token for us

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
