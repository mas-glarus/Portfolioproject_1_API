const apiKey = "BLMFFWPCzvU5LD1g0rwVrFsznX47BPiRRMhpPtTNyOSktCRiTB";
const apiSecret = "16ouruHP8NBNMiL4R4ituHEW4GdlgwebiGTFmBah";
const dog = document.querySelector("#animalType__dog");
const cat = document.querySelector("#animalType__cat");
const bird = document.querySelector("#animalType__bird");
let animalType = "";

function onClickHandlerDog() {
	animalType = "Dog";
	location.href = "./index_animals.html";
	sessionStorage.setItem("animal", animalType);
}

dog.addEventListener("click", onClickHandlerDog);

function onClickHandlerCat() {
	animalType = "Cat";
	location.href = "./index_animals.html";
	sessionStorage.setItem("animal", animalType);
}

cat.addEventListener("click", onClickHandlerCat);

function onClickHandlerBird() {
	animalType = "Bird";
	location.href = "./index_animals.html";
	sessionStorage.setItem("animal", animalType);
}

bird.addEventListener("click", onClickHandlerBird);
