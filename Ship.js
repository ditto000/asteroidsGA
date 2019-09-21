class Ship {

	constructor(shipBrain){
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.alive = true;
		this.shipSize = cShipSize;
		this.bullets = [];//new Bullet(180)];
		this.finalScore = 0;
		this.fitness = 0;
		angleMode(DEGREES);

		if (shipBrain){
			this.nn = shipBrain.copy();
		}
		else{
			this.nn = new NeuralNetwork(6, 6, 3);
		}

	}
	show(){
		//ellipse(this.x, this.y, 10);
		push();
		translate(tempWindowWidth / 2, tempWindowHeight / 2);
		rotate(this.angle);
		rect(this.x - (this.shipSize / 2), this.y - (this.shipSize / 2), this.shipSize, this.shipSize);
		pop();
		//console.log(this.bullets);
	}

	turn(tAngle){
		this.angle += tAngle;
		if (this.angle > 360) this.angle -= 360;
		if (this.angle < 0) this.angle += 360;
	}
	
	fire(){
		this.bullets.push(new Bullet(this.angle));
		//this.turn(3);
	}
	moveBullets(){
		for (let b of this.bullets){
			b.moveUp();
		}
	}
	checkDeadBullets(){
		this.bullets = this.bullets.filter(b => {
			if (b.x < -tempWindowWidth / 2 || b.x > tempWindowWidth / 2){
				return false;
			}
			if (b.y < -tempWindowHeight / 2 || b.y > tempWindowHeight / 2) return false;
			return true;
		});
		//console.log(this.bullets);
	}

	determineOutput(inAstroids){
		return this.nn.predict(Matrix.arrayToMatrix(this.determineInput(inAstroids)));
	}
	determineInput(inAstroids){
		if (inAstroids.length == 0){
			return [0, 1, 0, 0, 1, 0];
		}

		let closestAstroid;
		let angleAstroid;

		let closestAstroidDistance = tempWindowHeight + tempWindowWidth;
		let closestAstroidAngle = 1000;
		let closeBulletHit = false;
		let angleAstroidDistance = tempWindowHeight + tempWindowWidth;
		let angleAstroidAngle = 1000;
		let angleBulletHit = false;

		let closestAngle = 1000;


		for (let a of inAstroids){
			let distDiff = this.findDistance(a);
			let angDiff = this.findAngleDiff(a);
			if (distDiff < closestAstroidDistance){
				closestAstroidDistance = distDiff;
				closestAstroidAngle = angDiff;
				closeBulletHit = this.findBulletHit(a);
				closestAstroid = a;
			}

			if (angDiff < 180){
				if (angDiff < closestAngle){
					angleAstroidDistance = distDiff;
					angleAstroidAngle = angDiff;
					closestAngle = angDiff;
					angleBulletHit = this.findBulletHit(a);
					angleAstroid = a;
				}
			}
			else{
				if ((360 - angDiff) < closestAngle){
					angleAstroidDistance = distDiff;
					angleAstroidAngle = angDiff;
					closestAngle = 360 - angDiff;
					angleBulletHit = this.findBulletHit(a);
					angleAstroid = a;
				}
			}
		}

		for (let a of inAstroids){
			a.colour = color(255, 255, 255);
		}
		closestAstroid.colour = color(0, 0, 255);
		angleAstroid.colour = color(255, 0, 0);
		if (closestAstroid == angleAstroid) closestAstroid.colour = color(255, 0, 255);
		let returnArray = [0, 0, 0, 0, 0, 0];// Closest astroid angle, distance, and bulletFired, then low angle astroid angle, distance, and bulletFired
		returnArray[0] = closestAstroidAngle / 360;
		returnArray[1] = closestAstroidDistance / Math.sqrt(Math.pow(tempWindowWidth / 2, 2) + Math.pow(tempWindowHeight / 2, 2));
		returnArray[2] = closeBulletHit ? 1 : 0;
		returnArray[3] = angleAstroidAngle / 360;
		returnArray[4] = angleAstroidDistance / Math.sqrt(Math.pow(tempWindowWidth / 2, 2) + Math.pow(tempWindowHeight / 2, 2));
		returnArray[5] = angleBulletHit ? 1 : 0;
		return returnArray;
	}

	findDistance(ast){
		return Math.sqrt(Math.pow(ast.x, 2) + Math.pow(ast.y, 2));
	}

	findAngleDiff(ast){
		let a = ast.angle - this.angle;
		if (a < 0) a += 360;
		if (a < 0)
			console.log(ast.angle + ", " + this.angle + ", " + a);
		return a;
	}

	findBulletHit(ast){
		for (let b of this.bullets){
			if (Math.abs(b.x) < Math.abs(ast.x) && Math.abs(b.y) < Math.abs(ast.y) &&
				(b.angle < ast.angle + 0.5 && b.angle > ast.angle - 0.5))
			{
				return true;
			}
		}
		return false;
	}

	mutate(){
		this.nn.mutate(0.6);

	}

}