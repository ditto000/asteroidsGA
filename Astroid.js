class Astroid{

	constructor(spawnX, spawnY){
		this.x = spawnX;
		this.y = spawnY;
		this.velo = 2; //works with 2
		this.size = 40; // = diameter
		this.angle = 0;
		this.colour = color(0, 0, 255);
		if (spawnX == 0){
			if (spawnY > 0){
				this.angle = 90;
			}
			else{
				this.angle = 270;
			}
		}
		else{
			this.angle = Math.atan(spawnY / spawnX) * 180 / Math.PI;
		}
		if (spawnX < 0){
			this.angle += 180;
		}
		if (this.angle < 0){
			this.angle += 360;
		}
		this.cAngle = Math.cos(this.angle / 180 * Math.PI) ;
		this.sAngle = Math.sin(this.angle / 180 * Math.PI);
	}

	show(){
		push();
		fill(this.colour);
		translate(tempWindowWidth / 2, tempWindowHeight / 2);
		ellipse(this.x, this.y, this.size);
		pop();
	}

	moveAstroid(){
		this.x -= this.velo * this.cAngle;
		this.y -= this.velo * this.sAngle;

	}

}