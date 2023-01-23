const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const goBack = document.querySelector("#goBack");
const animalTypeOf = sessionStorage.getItem("animal");
let animalLocation = "";
const locationFL = document.querySelector("#FL");
const locationLA = document.querySelector("#LA");
const locationTX = document.querySelector("#TX");
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

goBack.addEventListener("click", () => {
	location.href = "./index.html";
});

function onClickHandlerFL() {
	animalLocation = "FL";
	location.href = "./index_animals_located.html";
	sessionStorage.setItem("location", animalLocation);
}

locationFL.addEventListener("click", onClickHandlerFL);

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
			if (data.animals.length === 0) {
				header2.innerHTML = `could not found any ${animalType}s`;
			} else {
				header2.innerHTML = `could find the following ${animalType}s`;
				for (let i = 0; i < data.animals.length; i++) {
					if (data.animals[i].photos.length > 0) {
						let imageUrl = data.animals[i].photos[0].full;
						let listElement = document.createElement("div");
						let image = document.createElement("img");
						let contact = document.createElement("p");
						contact.innerHTML = data.animals[i].contact.email;
						image.src = imageUrl;
						image.style.width = "10rem";
						listElement.innerHTML = data.animals[i].name;
						listElement.classList.add("flexColumn");
						animalList.appendChild(listElement);
						listElement.appendChild(image);
						listElement.appendChild(contact);
					} else {
						console.log("no foto found");
					}
				}
			}
			//--- Loading animation end ---//
			hideLoading();
		})
		.catch(function (err) {
			// Log any errors
			console.log("something went wrong", err);
		});
}

getAnimals(animalTypeOf);
