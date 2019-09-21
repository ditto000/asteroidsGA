class Bullet{

	constructor(angle){
		this.angle = angle;
		this.speed = 7;
		this.bulletSize = 10;
		this.x = cShipSize / 2 * Math.cos(angle * Math.PI / 180);
		this.y = cShipSize / 2 * Math.sin(angle * Math.PI / 180);
	}
	show(){
		push();
		translate(tempWindowWidth / 2, tempWindowHeight / 2);
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.bulletSize);
		pop();
	}
	moveUp(){
		//console.log("hello");
		this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
		this.y += this.speed * Math.sin(this.angle * Math.PI / 180);

	}

	//returns true if the bullet has not hit the astroid
	hit(ast){
		return !collideCircleCircle(this.x, this.y, this.bulletSize, ast.x, ast.y, ast.size);
	}


}