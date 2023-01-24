const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const goBack = document.querySelector("#goBack");
const animalTypeOf = sessionStorage.getItem("animal");
let animalLocation = "";
const loader = document.querySelector("#loading");
const select = document.querySelector("#locations");
const animalList = document.querySelector("#animalList")

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

goBack.addEventListener("click", () => {
	location.href = "./index.html";
});

//--- catch location from dropdown ---///
function updateLocation() {
	let selectValue = select.options[select.selectedIndex].value;
	if (selectValue === "FL") {
		animalLocation = "FL";
		location.href = "./index_animals_located.html";
		sessionStorage.setItem("location", animalLocation);
	} else if (selectValue === "LA") {
		animalLocation = "LA";
		location.href = "./index_animals_located.html";
		sessionStorage.setItem("location", animalLocation);
	} else if (selectValue === "TX") {
		animalLocation = "TX";
		location.href = "./index_animals_located.html";
		sessionStorage.setItem("location", animalLocation);
	}
}

select.addEventListener("change", updateLocation);

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
						//--- animal image ---//
						let image = document.createElement("img");
						let imageUrl = data.animals[i].photos[0].full;
						image.src = imageUrl;
						image.style.width = '10rem';
						image.style.borderRadius = '0.8rem';
						//--- END animal image ---//
						//--- Card construction --- //
						let listElement = document.createElement("div");
						let topDiv = document.createElement("div");
						let bottomDiv = document.createElement("div");
						let bottomDivLeft = document.createElement("div");
						let bottomDivRight = document.createElement("div");
						animalList.appendChild(listElement);
						animalList.classList.add('grid')
						listElement.classList.add('listElementDiv')
						listElement.appendChild(topDiv);
						listElement.appendChild(bottomDiv);
						topDiv.appendChild(image);
						topDiv.classList.add('topDivStyle');
						bottomDiv.appendChild(bottomDivLeft);
						bottomDiv.appendChild(bottomDivRight);
						bottomDiv.classList.add('bottomDivStyle')
						//--- End card construction --- //
						//--- Animal name --- //
						bottomDivLeft.innerHTML = `"${data.animals[i].name}"`;
						bottomDivLeft.classList.add('bottomDivLeftStyle')
						//--- END Animal name --- //
						//---Contact via Email ---//
						let imageContact = document.createElement('img');
						imageContact.src = './images/mail.svg';
						imageContact.style.width = '3rem';
						let contact = document.createElement("a");
						contact.href = `mailto:${data.animals[i].contact.email}`;
						contact.appendChild(imageContact)
						bottomDivRight.appendChild(contact);
						bottomDivRight.classList.add('bottomDivRightStyle')
						//---END Contact via Email ---//
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
