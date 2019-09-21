let tempWindowWidth = 1000;
let tempWindowHeight = 1000;
let turnSpeed = 5.5;
let shotFrequency = 5;
let astroidSpawnTimer = 30;
let shipSize = 50;
const totalLife = 3;
let life;
let score;
let ship;
let astroids = [];
let nn;
let slider;
let counter;
let button;
let randomNumbers = [0.13776806734511604, 0.6584253697892262, 0.8801090021238673, 0.18159000935844727, 0.344328354622097, 0.45661997922524367,
0.7252699832528611, 0.15269719546091975, 0.901128586404307, 0.6778004673019571, 0.7837172167303137, 0.9811002752043425, 0.7417067952496044,
0.15666835700237192, 0.8017100509159825, 0.8767048145100258, 0.4361373497918113, 0.17773778843086196, 0.8698871864876869, 0.41976482806257476, 
0.1257719499837282, 0.37765051979422903, 0.9869666975989326, 0.034301111830858266, 0.24573502434608896, 0.27919822248460413, 0.6580908083877406, 
0.4863702745708436, 0.6688174604452406, 0.873596433581399, 0.3654920053727633, 0.6221556800614922, 0.7484911071515501, 0.500433877468792, 
0.6168677371068092, 0.6004162450618353, 0.9076887276053298, 0.24439171677457594, 0.7865919021719496, 0.95726851249551, 0.6999434990791493, 
0.6014487593644968, 0.7223716463099135, 0.6594966099383381, 0.746779642572444, 0.10690141313143542, 0.09354552045235276, 0.25750962517370857, 
0.7995286708237317, 0.19253703767675923, 0.5247085670503129, 0.1411056011101195, 0.2716599590055693, 0.1803304328330786, 0.7496108805206143,
0.5743808759265645, 0.29546730560735446, 0.7499869350983079, 0.21368250387426357, 0.8165942841457601, 0.086611502607292, 0.9097188933579659, 
0.10389255189455437, 0.7848069940564588, 0.36151844961159196, 0.7175491023015399, 0.15647599250143718, 0.8529966202953616, 0.6007966304287375, 
0.04289928517278785, 0.13695963482539297, 0.9686057409310587, 0.5096668407799014, 0.38421155131896856, 0.18827793750231447, 0.17201489134510184, 
0.9026735998600282, 0.5906718206435215, 0.6121618657293952, 0.8841249839586092, 0.3205630988540171, 0.21223110243398002, 0.2465227075600025, 
0.8266018455996305, 0.7642159681489542, 0.1610501078050226, 0.0146098030459052, 0.7962460375005174, 0.5527690974587542, 0.8447013638996983,
0.4838257051891688, 0.13533622086002262, 0.9504131871345771, 0.5001072072996935, 0.002670699684121036, 0.6930288308105221, 0.8274608115051516,
0.9912570265534764, 0.9035846932205895, 0.5433562479652136];
let nonRandomIndex = 0;
const POPULATION = 2;
let ships = [];
let curShip;
let generation = 0;

let aliveTime = 1000;

function preload(){
}

function setup() {
	//createArrayOfRandom(100);
	//nn = new NeuralNetwork(6, 6, 3);
	life = totalLife;
	counter = 0;
	createCanvas(tempWindowWidth, tempWindowHeight);
	slider = createSlider(1, 10, 1);
	slider.position(0, tempWindowHeight);
	button = createButton('Clear Astroids');
	button.position(tempWindowWidth - 100, tempWindowHeight);
	button.mousePressed(clearAstroids);
	ship = new Ship(shipSize);
	score = 0;
	for (let i = 0; i < POPULATION; i++){
		ships[i] = new Ship(shipSize);
	}
	curShip = 0;
	//setInterval(fireShip, shotFrequency);
	//setInterval(randomSpawnAstroid, astroidSpawnTimer); //randomly spawns astroids
	//setInterval(nonRandomSpawnAstroid, 1500); //systematically spawns astroids
}

function draw() {
	for (let tick = 0; tick < slider.value(); tick++){
		if (life > 0){
			if (counter % shotFrequency == 0){
				fireShip();
			}
			if (counter % astroidSpawnTimer == 0){
				randomSpawnAstroid();
			}
			counter++;
			neuralNetworkPlay(); //neural network player
			//checkKeyPressed(); //human player
			updateBullets();
			astroids.map(updateAstroids);
			checkAstroids();
			checkHit();
		}
		else{
			curShip++;
			if (curShip >= POPULATION){


				//new generation
				curShip = 0;
				generation++;
			}

			//reset
			life = totalLife;
			score = 0;

		}
	}

	//All draw stuff
	background(50);
	ship.show();

	for (let b of ship.bullets){
		b.show();
	}
	for (let a of astroids){
		a.show();
	}

	push();
	fill(0, 255, 0);
	rect(0, 5, tempWindowWidth * life / totalLife, 5);
	pop();
	push();
	fill(255);
	textSize(50);
	text("Score: " + score, 0, tempWindowHeight - 30);
	text("Generation: " + generation + ", Ship#: " + curShip, tempWindowWidth - 530, tempWindowHeight - 30);
	pop();
}

function checkKeyPressed(){
	if (keyIsDown(LEFT_ARROW)){
		ship.turn(-turnSpeed);
	}
	if (keyIsDown(RIGHT_ARROW)){
		ship.turn(turnSpeed);
	}
}

function neuralNetworkPlay(){
	let choice = ship.determineOutput(astroids);
	console.log(choice[0]); //LOG THE DECIDED ACTION
	if (choice[0] == 1){
		ship.turn(-turnSpeed);
	}
	else if (choice[0] == 2){
		ship.turn(turnSpeed);
	}
}

function fireShip(){
	ship.fire();
}

function updateBullets(){
	ship.moveBullets();
	ship.checkDeadBullets();
}

function randomSpawnAstroid(){
	if (Math.random() < 0.6){
		let determiningFactor = random(1);
		let asX;
		let asY;
		if (determiningFactor < 0.25){
			asX = -tempWindowWidth / 2;
			asY = random(-tempWindowHeight / 2, tempWindowHeight / 2);
		}
		else if (determiningFactor < 0.5){
			asX = tempWindowWidth / 2;
			asY = random(-tempWindowHeight / 2, tempWindowHeight / 2);
		}
		else if (determiningFactor < 0.75){
			asX = random(-tempWindowWidth / 2, tempWindowWidth / 2);
			asY = -tempWindowHeight / 2;
		}
		else{
			asX = random(-tempWindowWidth / 2, tempWindowWidth / 2);
			asY = tempWindowHeight / 2;
		}

		astroids.push(new Astroid(asX, asY));

	}
}

function nonRandomSpawnAstroid(){
	let asX;
	let asY;
	if (nonRandomIndex < 100){
		if (randomNumbers[nonRandomIndex] < 0.25){
			asX = -tempWindowWidth / 2;
			asY = randomNumbers[nonRandomIndex] * 4 * tempWindowHeight -tempWindowHeight / 2;
		}
		else if (randomNumbers[nonRandomIndex] < 0.5){
			asX = tempWindowWidth / 2;
			asY = (randomNumbers[nonRandomIndex] - 0.25) * 4 * tempWindowHeight -tempWindowHeight / 2;
		}
		else if (randomNumbers[nonRandomIndex] < 0.75){
			asX = (randomNumbers[nonRandomIndex] - 0.5) * 4 * tempWindowWidth -tempWindowWidth / 2;
			asY = -tempWindowHeight / 2;
		}
		else{
			asX = (randomNumbers[nonRandomIndex] - 0.75) * 4 * tempWindowWidth -tempWindowWidth / 2;
			asY = tempWindowHeight / 2;
		}
		
		astroids.push(new Astroid(asX, asY));
		nonRandomIndex++;}
	}


	function updateAstroids(a){
		a.moveAstroid();
	}

	function checkAstroids(){
		astroids = astroids.filter(checkAstroidCollide);
	}

	function checkHit(){
		for (let i of ship.bullets){
			astroids = astroids.filter(a => {
				if (!i.hit(a)) score ++;
				return i.hit(a);
			})
		}
	}

	function checkAstroidCollide(ast){
		if (ast.x < (ship.shipSize / 2 + ast.size / 2) && 
			ast.x > (-ship.shipSize / 2 - ast.size / 2) && 
			ast.y < (ship.shipSize / 2 + ast.size / 2) && 
			ast.y > (-ship.shipSize / 2 - ast.size / 2)){
			life -= 1;
		return false;
	}
	return true;

}



function createArrayOfRandom(arrSize){
	let ayylmao = [];
	for (let i = 0; i < arrSize; i++){
		ayylmao.push(Math.random());
	}
	console.log(ayylmao);
}


function clearAstroids(){
	astroids = [];
}

