

function pickOne(inShips){
	let index = 0;
	let r = Math.random();

	while (r > 0 && index < inShips.length){
		r -= inShips[index].fitness;
		index++;
	}
	index--;
	//console.log("SHIP " + index);
	let pickedShip = inShips[index];
	let childShip = new Ship(pickedShip.nn);
	childShip.mutate();
	return childShip;
}



function nextGeneration(){

	calculateFitness();
	for (let i = 0; i < POPULATION; i++){
		//console.log("Ship " + i + " has picked ");
		newShips[i] = pickOne(ships);
	}
	ships = newShips;
	newShips = [];
}

function calculateFitness(){
	let sum = 0;
	let highestScore = 0;

	for (let curShip of ships){
		sum += curShip.finalScore;
	}
	for (let curShip of ships){
		if (curShip.finalScore > highestScore){
			highestScore = curShip.finalScore;
		}
		curShip.fitness = curShip.finalScore / sum;
	}
	console.log(highestScore);
	//Tests to see the sum of all fitnesses of ships
	// let testSum = 0;
	// for (curShip of ships){
	// 	testSum += curShip.fitness;
	// }
	// console.log(testSum);
}

function nextGeneration2(){
	//sort smallest to biggest
	ships.sort((a, b) => {
		return a.finalScore - b.finalScore;
	});
	//console.log(ships);
	let goodShips = calculateFitness2();
	//console.log(goodShips);
	let highestScore = 0;

	for(let i = 0; i < goodShips.length; i++){
		if (goodShips[i].finalScore > highestScore){
			highestScore = goodShips[i].finalScore;
		}
		newShips[i] = new Ship(goodShips[i].nn);
	}

	for (let i = goodShips.length; i < POPULATION; i++){
		if (ships[i].finalScore > highestScore){
			highestScore = ships[i].finalScore;
			//checks for weird cases
			console.log("Huh?");
		}
		newShips[i] = pickOne(goodShips);
	}

	console.log(highestScore);
	ships = newShips;
	newShips = [];
}

function calculateFitness2(){
	let sum = 0;
	let retShips = [];
	let numGoodShips = Math.floor(POPULATION / 10);

	//Display scores of each ship
	// ships.forEach(a => {
	// 	console.log(a.finalScore);
	// });

	//Old code for filling retShips, still needed?
	// for (let i = 0; i < numGoodShips; i++){
	// 	retShips[i] = new Ship(ships[POPULATION - i - 1].nn);
	// 	retShips[i].finalScore = ships[POPULATION - i - 1].finalScore;
	// }

	for (let curShip of ships){
		sum += curShip.finalScore;
	}
	for (let curShip of ships){
		curShip.fitness = curShip.finalScore / sum;
	}
	for (let i = 0; i < numGoodShips; i++){
		retShips[i] = ships[POPULATION - 1 - i];
	}
	// console.log(retShips[0].nn.hBias);

	return retShips;
	//Tests to see the sum of all fitnesses of ships
	// let testSum = 0;
	// for (curShip of ships){
	// 	testSum += curShip.fitness;
	// }
	// console.log(testSum);
}





function nextGeneration3(){

	calculateFitness3();

	for(let i = 0; i < bestShips.length; i++){
		newShips[i] = new Ship(bestShips[i].nn);
	}

	for (let i = bestShips.length; i < POPULATION; i++){
		//console.log("Ship " + i + " has picked ");
		newShips[i] = pickOne(bestShips);
	}
	ships = newShips;
	newShips = [];
}

function calculateFitness3(){
	let sum = 0;
	for (let i = 0; i < ships.length; i++){
		for (let j = 0; j < NUMBESTSHIPS; j++){
			if (ships[i].finalScore > bestShips[j].finalScore){
				bestShips.splice(j, 1);
				bestShips.push(ships[i]);
				j--;
				console.log('a');
			}
		}
	}
	for (let curShip of bestShips){
		sum += curShip.finalScore;
	}
	for (let curShip of bestShips){
		curShip.fitness = curShip.finalScore / sum;
	}
	console.log(sum);
	//Tests to see the sum of all fitnesses of ships
	// let testSum = 0;
	// for (curShip of ships){
	// 	testSum += curShip.fitness;
	// }
	// console.log(testSum);
}
