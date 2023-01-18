const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const goBack = document.querySelector("#goBack");
const animalTypeOf = sessionStorage.getItem("animal");
let animalLocation = sessionStorage.getItem("location");
const header1 = document.querySelector("#header1");
const header2 = document.querySelector("#header2");
const goHome = document.querySelector("#goHome");

const loader = document.querySelector("#loading");

//--- Loading animation ---//
function displayLoading() {
	loader.classList.add("heart");
	setTimeout(() => {
		loader.classList.remove("heart");
	}, 5000);
}

function hideLoading() {
	loader.classList.remove("heart");
}

//--- ---//

header1.innerHTML = `You're looking for: ${animalTypeOf}s`;
header2.innerHTML = `located in: ${animalLocation}`;

goHome.addEventListener("click", () => {
	location.href = "./index.html";
});

goBack.addEventListener("click", () => {
	location.href = "./index_animals.html";
});

function getAnimals(animalType, location) {
	//--- Loading animation ---//
	displayLoading();
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
			return fetch(
				"https://api.petfinder.com/v2/animals?type=" +
					animalType +
					"&location=" +
					location,
				{
					headers: {
						Authorization: data.token_type + " " + data.access_token,
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			);
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
			//--- Loading animation end ---//
			hideLoading();
		})
		.catch(function (err) {
			// Log any errors
			console.log("something went wrong", err);
		});
}

getAnimals(animalTypeOf, animalLocation);
