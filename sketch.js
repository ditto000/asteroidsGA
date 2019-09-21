let tempWindowWidth = 1000; //window width
let tempWindowHeight = 1000; //window height
let turnSpeed = 5.5; //how fast Ships can turn
let shotFrequency = 40; //how often ships can fire, lower = faster
let astroidSpawnTimer = 50; //how often astroids spawn, lower = faster spawn
let cShipSize = 50; //size of each Ship
const totalLife = 3; //total number of lives each ship has
let life; //life of the current ship
let astroids = []; //array that holds the astroids currently on the screen
let slider; //slider to allow user to control speed
let counter; //counter to assist with controlling speed
let button; //button to clear all bullets and astroids on map
let randomNumbers = [0.8644922892004394, 0.15017863468964943, 0.6123823146022012, 0.5195812283565588, 0.019555701306265716, 0.6724919286406397, 0.5013913109188375, 0.9074752052022006, 0.03978268901917037, 0.5452278153589178, 0.881643459215611, 0.6241856766536871, 0.1163980233063664, 0.7277930045202534, 0.9917838994756059, 0.9593551988605657, 0.5046238346599434, 0.8778433297068711, 0.505565509654595, 0.8798446063513348, 0.9968271997675224, 0.14637592223429463, 0.2794606228165104, 0.39000833087988074, 0.545747123620759, 0.8160546089220817, 0.2614797473335848, 0.32252785588528954, 0.7723226350928927, 0.8524541021868477, 0.167130018245236, 0.6048810976397072, 0.26792549552726164, 0.0032505833566438547, 0.8643705365330252, 0.5142388782535561, 0.5314837502905152, 0.42459445032048504, 0.6227362732583956, 0.9371770751662594, 0.8370543302889641, 0.8105345921881797, 0.871381375074332, 0.35963419661332074, 0.8952838658355395, 0.08279879953579172, 0.06203865999603697, 0.615426245784084, 0.08722347217803095, 0.9813488055392343, 0.3386318366338945, 0.3484207339269052, 0.31694619293909865, 0.19783964506656004, 0.6212607606071072, 0.4080413309172637, 0.6566557136347442, 0.9023312509830062, 0.38683798065596786, 0.9583020734934569, 0.5132089952048311, 0.7132128182125004, 0.2005946667313867, 0.5945574184799607, 0.18941111633407504, 0.7386596044964375, 0.9631511459789992, 0.9634821103813913, 0.7229240802814514, 0.3226626055210158, 0.3169505273260136, 0.06369782423859238, 0.0630051276167567, 0.8362796113250475, 0.2982630182193957, 0.5629611063394122, 0.3032137834739652, 0.8694540276587182, 0.40043460835529365, 0.8991495809616286, 0.7076456795990631, 0.5432741456075176, 0.2620989666987874, 0.24288093584252612, 0.6197723018062806, 0.49872635265776877, 0.7340655750270622, 0.7806893603922092, 0.8432349767226397, 0.7698373594639263, 0.5349475863484556, 0.6067650125815609, 0.6963357487214108, 0.14913869613175956, 0.21033366104322315, 0.991069308604263, 0.6815218208767557, 0.29665697750009845, 0.5101638320264419, 0.09168480247067956]; //set of random numbers to determine non-random astroid spawning
let nonRandomIndex; //index for keeping track of astroids when the spawning is not random
const POPULATION = 10; //number of ships in each generation
let ships = [];
let newShips = [];
let bestShips = [];
const NUMBESTSHIPS = 10;
let curShip;
let generation = 0;
let canFire = true;
const numAstroidsCreate = 100;
let smartBrain = new NeuralNetwork(6, 6, 3);
let shootCD = 0;
let gameReady = true;
let firstTimeDied = false;




//Setup function part of p5.js which runs once at the beginning of the program
function setup() {
	life = totalLife;
	counter = 0;
	createCanvas(tempWindowWidth, tempWindowHeight);
	slider = createSlider(1, 20, 1);
	slider.position(0, tempWindowHeight);
	button = createButton('Clear');
	button.position(tempWindowWidth - 100, tempWindowHeight);
	button.mousePressed(clearAstroids);
	createSmartOne();
	for (let i = 0; i < POPULATION; i++){
		ships[i] = new Ship();//smartBrain);
	}
	curShip = 0;
	nonRandomIndex = 0;
	//randomNumbers = createArrayOfRandom(numAstroidsCreate);
}

//Draw function part of p5.js which runs some number of times per 
function draw() {

	//allows for the user to speed up the training 
	for (let tick = 0; tick < slider.value(); tick++){
		if (life > 0){
			// if (counter % shotFrequency == 0 && canFire){
			// 	fireShip();
			// }
			if (counter % astroidSpawnTimer == 0){
				nonRandomSpawnAstroid();
				//randomSpawnAstroid();
			}
			counter++;
			neuralNetworkPlay(); //neural network player
			//checkKeyPressed(); //human player
			updateBullets();
			astroids.map(updateAstroids);
			checkAstroids();
			checkHit();
			ships[curShip].finalScore++;
			shootCD++;
		}
		else{
			curShip++;
			if (curShip >= POPULATION){
				nextGeneration2();

				//new generation
				//randomNumbers = createArrayOfRandom(numAstroidsCreate);
				curShip = 0;
				generation++;
			}
			//reset
			nonRandomIndex = 0;
			life = totalLife;
			clearAstroids();
			shootCD = 0;
			counter = 0;
		}
	}

	//All draw stuff
	background(50);
	ships[curShip].show();

	for (let b of ships[curShip].bullets){
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
	text("Score: " + ships[curShip].finalScore, 0, tempWindowHeight - 30);
	text("Generation: " + generation + ", Ship#: " + curShip, tempWindowWidth - 575, tempWindowHeight - 30);
	pop();
}

function checkKeyPressed(){
	if (keyIsDown(LEFT_ARROW)){
		ships[curShip].turn(-turnSpeed);
	}
	if (keyIsDown(RIGHT_ARROW)){
		ships[curShip].turn(turnSpeed);
	}
}

function neuralNetworkPlay(){
	let choice = ships[curShip].determineOutput(astroids);
	//console.log(choice[0]); //LOG THE DECIDED ACTION
	if (choice[0] == 1){
		//canFire = false;
		ships[curShip].turn(-turnSpeed);
	}
	else if (choice[0] == 2){
		//canFire = false;
		ships[curShip].turn(turnSpeed);
	}
	else if (choice[0] == 0){
		if (shootCD > shotFrequency){
			fireShip();
			shootCD = 0;
		}
	}
}

function fireShip(){
	ships[curShip].fire();
}

function updateBullets(){
	ships[curShip].moveBullets();
	ships[curShip].checkDeadBullets();
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
	if (nonRandomIndex < numAstroidsCreate){
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
		nonRandomIndex++;
	}
}


function updateAstroids(a){
	a.moveAstroid();
}

function checkAstroids(){
	astroids = astroids.filter(checkAstroidCollide);
}

function checkHit(){
	for (let i of ships[curShip].bullets){
		astroids = astroids.filter(a => {
			//if (!i.hit(a)) ships[curShip].finalScore += 100;
			return i.hit(a);
		})
	}
}

function checkAstroidCollide(ast){
	if (ast.x < (ships[curShip].shipSize / 2 + ast.size / 2) && 
		ast.x > (-ships[curShip].shipSize / 2 - ast.size / 2) && 
		ast.y < (ships[curShip].shipSize / 2 + ast.size / 2) && 
		ast.y > (-ships[curShip].shipSize / 2 - ast.size / 2)){
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
	return ayylmao;
}


function clearAstroids(){
	astroids = [];
	ships[curShip].bullets = [];
}

function createSmartOne(){

	smartBrain.hBias = Matrix.arrayToMatrix([
		-0.9602502117697558,
		0.09734016048652716,
		-0.6720615321736609,
		-0.24626331966140302,
		-0.16839615372936967,
		0.18423105551833485]);
	smartBrain.oBias = Matrix.arrayToMatrix([
		-0.7023043967801383,
		0.5283406844208045,
		-0.07534943159850238]);
	smartBrain.weightsHO.data[0][0] = -0.5075037006161724;
	smartBrain.weightsHO.data[0][1] = -0.1730117585681583;
	smartBrain.weightsHO.data[0][2] = -0.668060663461663;
	smartBrain.weightsHO.data[0][3] = 0.014644327085087117;
	smartBrain.weightsHO.data[0][4] = -0.7774537281399905;
	smartBrain.weightsHO.data[0][5] = 0.6680112556880808;
	smartBrain.weightsHO.data[1][0] = -0.5561819214403441;
	smartBrain.weightsHO.data[1][1] = -0.7486129278426255;
	smartBrain.weightsHO.data[1][2] = -0.30543297527068347;
	smartBrain.weightsHO.data[1][3] = 0.4330513026976197;
	smartBrain.weightsHO.data[1][4] = 0.9383898000995265;
	smartBrain.weightsHO.data[1][5] = -0.5139371293899897;
	smartBrain.weightsHO.data[2][0] = -0.7478993177107882;
	smartBrain.weightsHO.data[2][1] = 0.7184945992347247;
	smartBrain.weightsHO.data[2][2] = 0.7925398636252163;
	smartBrain.weightsHO.data[2][3] = 0.789140667318001;
	smartBrain.weightsHO.data[2][4] = -0.9447109630535309;
	smartBrain.weightsHO.data[2][5] = 0.37583477985052216;

	smartBrain.weightsIH.data[0][0] = 0.39040654265932107;
	smartBrain.weightsIH.data[0][1] = -0.03042534347474568;
	smartBrain.weightsIH.data[0][2] = -0.8692491377013654;
	smartBrain.weightsIH.data[0][3] = -0.5958251067376792;
	smartBrain.weightsIH.data[0][4] = 0.7227790351185694;
	smartBrain.weightsIH.data[0][5] = -0.3826924262262188;
	smartBrain.weightsIH.data[1][0] = -0.3483889690819679;
	smartBrain.weightsIH.data[1][1] = 0.9508926624649399;
	smartBrain.weightsIH.data[1][2] = 0.6174076551916388;
	smartBrain.weightsIH.data[1][3] = -0.09273403644057643;
	smartBrain.weightsIH.data[1][4] = -0.022918516569457648;
	smartBrain.weightsIH.data[1][5] = -0.4842583432778569;
	smartBrain.weightsIH.data[2][0] = 0.0010656706878076072;
	smartBrain.weightsIH.data[2][1] = -0.007788482000000485;
	smartBrain.weightsIH.data[2][2] = 0.717905078803792;
	smartBrain.weightsIH.data[2][3] = 0.5114594451853764;
	smartBrain.weightsIH.data[2][4] = 0.4298426337437693;
	smartBrain.weightsIH.data[2][5] = -0.030809631117327818;
	smartBrain.weightsIH.data[3][0] = 0.9051721625426215;
	smartBrain.weightsIH.data[3][1] = 0.4273241100601375;
	smartBrain.weightsIH.data[3][2] = -0.20623633176707523;
	smartBrain.weightsIH.data[3][3] = 0.017753915327050063;
	smartBrain.weightsIH.data[3][4] = -0.5772655440829833;
	smartBrain.weightsIH.data[3][5] = -0.06490307682201113;
	smartBrain.weightsIH.data[4][0] = 0.6998976694720773;
	smartBrain.weightsIH.data[4][1] = -0.2294981957206228;
	smartBrain.weightsIH.data[4][2] = 0.47592259187750896;
	smartBrain.weightsIH.data[4][3] = 0.9750719393905847;
	smartBrain.weightsIH.data[4][4] = 0.9495498479185622;
	smartBrain.weightsIH.data[4][5] = 0.9387924647295778;
	smartBrain.weightsIH.data[5][0] = 0.9275019085939893;
	smartBrain.weightsIH.data[5][1] = -0.4418067244082531;
	smartBrain.weightsIH.data[5][2] = -0.17659453238775003;
	smartBrain.weightsIH.data[5][3] = -0.6614735077474703;
	smartBrain.weightsIH.data[5][4] = -0.39249728624769364;
	smartBrain.weightsIH.data[5][5] = -0.4992384551488982;
}

//works when astroid.velo = 2, turnspeed = 5.5, shotFrequency = 15, astroidSpawnTimer = 50, totallife = 3, POPULATION = 150
function createSmartOne2(){

	smartBrain.hBias = Matrix.arrayToMatrix([
		-124.9010239121979,
		285.21001587925,
		459.9616331117437,
		2170.486615505308,
		-1920.729865544095,
		108.20561911073449]);
	smartBrain.oBias = Matrix.arrayToMatrix([
		-2461.6778774163713,
		857.6018359869396,
		-1897.27461896797]);
	smartBrain.weightsHO.data[0][0] = -1024.8328271203925;
	smartBrain.weightsHO.data[0][1] = -571.3316704842214;
	smartBrain.weightsHO.data[0][2] = 1127.5034512302266;
	smartBrain.weightsHO.data[0][3] = 152.67882415460838;
	smartBrain.weightsHO.data[0][4] = 2207.352534762059;
	smartBrain.weightsHO.data[0][5] = -426.5844832452619;
	smartBrain.weightsHO.data[1][0] = 1473.7878252590074;
	smartBrain.weightsHO.data[1][1] = -727.9148364530631;
	smartBrain.weightsHO.data[1][2] = 1106.52242841125;
	smartBrain.weightsHO.data[1][3] = -3382.706240354568;
	smartBrain.weightsHO.data[1][4] = -1105.914164482819;
	smartBrain.weightsHO.data[1][5] = -3365.349419357551;
	smartBrain.weightsHO.data[2][0] = -83.46413636532552;
	smartBrain.weightsHO.data[2][1] = 613.1551780227315;
	smartBrain.weightsHO.data[2][2] = 3554.6957961101384;
	smartBrain.weightsHO.data[2][3] = 688.6515643728482;
	smartBrain.weightsHO.data[2][4] = 639.0911909406665;
	smartBrain.weightsHO.data[2][5] = 1284.9283531352824;

	smartBrain.weightsIH.data[0][0] = 1598.6147307415047;
	smartBrain.weightsIH.data[0][1] = -1787.7165742144507;
	smartBrain.weightsIH.data[0][2] = 4054.8936243993317;
	smartBrain.weightsIH.data[0][3] = 504.20077271847526;
	smartBrain.weightsIH.data[0][4] = 1395.8931985095746;
	smartBrain.weightsIH.data[0][5] = -539.4443925023224;
	smartBrain.weightsIH.data[1][0] = -1847.7593108060253;
	smartBrain.weightsIH.data[1][1] = -1168.6249936943436;
	smartBrain.weightsIH.data[1][2] = -1552.651694635504;
	smartBrain.weightsIH.data[1][3] = 601.6057285290108;
	smartBrain.weightsIH.data[1][4] = 1072.013582673635;
	smartBrain.weightsIH.data[1][5] = 424.5045071503753;
	smartBrain.weightsIH.data[2][0] = -2789.222626644961;
	smartBrain.weightsIH.data[2][1] = 683.1052210421424;
	smartBrain.weightsIH.data[2][2] = -567.0652735114406;
	smartBrain.weightsIH.data[2][3] = 2335.981381963901;
	smartBrain.weightsIH.data[2][4] = 1481.6409512426906;
	smartBrain.weightsIH.data[2][5] = -438.15445023917925;
	smartBrain.weightsIH.data[3][0] = -3223.050837268565;
	smartBrain.weightsIH.data[3][1] = -568.935705361331;
	smartBrain.weightsIH.data[3][2] = -832.4588880523802;
	smartBrain.weightsIH.data[3][3] = -697.4338179942218;
	smartBrain.weightsIH.data[3][4] = -2141.499410491776;
	smartBrain.weightsIH.data[3][5] = 569.9623809114795;
	smartBrain.weightsIH.data[4][0] = 1187.221744770886;
	smartBrain.weightsIH.data[4][1] = -886.9873044731596;
	smartBrain.weightsIH.data[4][2] = 787.58873171285;
	smartBrain.weightsIH.data[4][3] = -341.3276841405706;
	smartBrain.weightsIH.data[4][4] = -604.6252098116712;
	smartBrain.weightsIH.data[4][5] = -449.9783601439814;
	smartBrain.weightsIH.data[5][0] = 545.3554698755063;
	smartBrain.weightsIH.data[5][1] = -1347.2173223014206;
	smartBrain.weightsIH.data[5][2] = 2399.8212420935174;
	smartBrain.weightsIH.data[5][3] = -2303.6494148914326;
	smartBrain.weightsIH.data[5][4] = -612.1180518531093;
	smartBrain.weightsIH.data[5][5] = -3115.5206276430395;
}