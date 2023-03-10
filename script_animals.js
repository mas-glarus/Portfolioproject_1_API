const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const goBack = document.querySelector("#goBack");
const animalTypeOf = sessionStorage.getItem("animal");
let animalLocation = "";
const loader = document.querySelector("#loading");
const select = document.querySelector("#locations");
const animalList = document.querySelector("#animalList");
const faviconLink = document.querySelector("#favicon");

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
			//Favicon
			if (animalType === "dog") {
				faviconLink.href = "./images/dog.svg";
			} else if (animalType === "cat") {
				faviconLink.href = "./images/cat.svg";
			} else if (animalType === "bird") {
				faviconLink.href = "./images/owl.svg";
			}
			//for loop over animals array:
			if (data.animals.length === 0) {
				header2.innerHTML = `could not found any ${animalType}s`;
				document.title = `can't find any ${animalType}s`;
			} else {
				header2.innerHTML = `could find the following ${animalType}s`;
				document.title = `beautiful ${animalType}s`;

				//filter duplicates
				const unique = [];
				for (const item of data.animals) {
					const isDuplicate = unique.find((obj) => obj.id === item.id);
					if (!isDuplicate) {
						unique.push(item);
					}
				}
				//END filter duplicates

				for (let i = 0; i < unique.length; i++) {
					if (unique[i].photos.length > 0  && unique[i].name.length < 12) {
						//--- animal image ---//
						let image = document.createElement("img");
						let imageUrl = unique[i].photos[0].full;
						image.src = imageUrl;
						image.style.width = "10rem";
						image.style.borderRadius = "0.8rem";
						// --- ADD Image ZOOM --- //
						image.addEventListener('click', () => {
							document.querySelector('.popup-image').style.display = 'block';
							document.querySelector('.popup-image img').src = imageUrl;
						})

						//---Remove Image ZOOM --- //
						document.querySelector('.imageSpan').addEventListener('click', () => {
							document.querySelector('.popup-image').style.display = 'none';
						})
						//--- END animal image ---//
						//--- Card construction --- //
						let listElement = document.createElement("div");
						let topDiv = document.createElement("div");
						let bottomDiv = document.createElement("div");
						let bottomDivLeft = document.createElement("div");
						let bottomDivRight = document.createElement("div");
						animalList.appendChild(listElement);
						animalList.classList.add("grid");
						listElement.classList.add("listElementDiv");
						listElement.appendChild(topDiv);
						listElement.appendChild(bottomDiv);
						topDiv.appendChild(image);
						topDiv.classList.add("topDivStyle");
						bottomDiv.appendChild(bottomDivLeft);
						bottomDiv.appendChild(bottomDivRight);
						bottomDiv.classList.add("bottomDivStyle");
						//--- End card construction --- //
						//--- Animal name & location--- //
						bottomDivLeft.innerHTML = `"${unique[i].name}"
						<br> state: ${unique[i].organization_id.substring(0, 2)}`;
						bottomDivLeft.classList.add("bottomDivLeftStyle");
						//--- END Animal name --- //
						//---Contact via Email ---//
						let imageContact = document.createElement("img");
						imageContact.src = "./images/mail.svg";
						imageContact.style.width = "3rem";
						let contact = document.createElement("a");
						contact.href = `mailto:${unique[i].contact.email}`;
						contact.appendChild(imageContact);
						bottomDivRight.appendChild(contact);
						bottomDivRight.classList.add("bottomDivRightStyle");
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
