//MAINLY COPIED FROM THECODINGTRAIN TUTORIAL ON NEURAL NETWORKS!

class Matrix{

	constructor(rows, columns){
		this.rows = rows;
		this.columns = columns;
		this.data = [];
		for (let i = 0; i < rows; i++){
			this.data.push([]);
			for (let j = 0; j < columns; j++){
				this.data[i].push(0);
			}
		}
	}

	multiply(a) {
		if (a instanceof Matrix) {
			if (this.rows !== a.rows || this.columns !== a.columns) {
				console.log("Multiply error");
				return;
			}
			for (let i = 0; i < this.rows; i++){
				for (let j = 0; j < this.columns; j++){
					this.data[i][j] *= a.data[i][j];
				}
			}
		}
		else{
			this.map(x => {
				return x * a;
			});
		}
	}

	static multiply(a, b) {
		if (a instanceof Matrix){
			if (a.columns != b.rows){
				console.log("Matrix multiplication requires a.columns = b.rows.");
				return;
			}
			let result = new Matrix(a.rows, b.columns);
			for (let i = 0; i < result.rows; i++) {
				for (let j = 0; j < result.columns; j++) {
					let sum = 0;
					for (let k = 0; k < a.columns; k++) {
						sum += a.data[i][k] * b.data[k][j];
					}
					result.data[i][j] = sum;
				}
			}
			return result;
		}
		else{
			let result = new Matrix(b.rows, b.columns);
			for (let i = 0; i < b.rows; i++){
				for (let j = 0; j < b.columns; j++){
					result.data[i][j] = a * b.data[i][j];
				}
			}
			return result;
		}
	}

	map(func){
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.columns; j++){
				this.data[i][j] = func(this.data[i][j]);
			}
		}
	}

	static map(a, func){
		for (let i = 0; i < a.rows; i++){
			for (let j = 0; j < a.columns; j++){
				a.data[i][j] = func(a.data[i][j]);
			}
		}
	}


	add(a){
		if (a.rows != this.rows || a.columns != this.columns){
			console.log("Rows and/or columns must be the same in matrix addition.");
			return;
		}
		for (let i = 0; i < a.rows; i++){
			for (let j = 0; j < a.columns; j++){
				this.data[i][j] += a.data[i][j];
			}
		}
	}

	static add(a, b){
		if (a.rows != b.rows || a.columns != b.columns){
			console.log("Rows and/or columns must be the same in matrix addition.");
			return;
		}
		let result = new Matrix(a.rows, a.columns);
		for (let i = 0; i < a.rows; i++){
			for (let j = 0; j < a.columns; j++){
				result.data[i][j] += a.data[i][j] + b.data[i][j];
			}
		}
		return result;
	}
	
	subtract(a){
		if (a.rows != this.rows || a.columns != this.columns){
			console.log("Rows and/or columns must be the same in matrix subtraction.");
			return;
		}
		for (let i = 0; i < a.rows; i++){
			for (let j = 0; j < a.columns; j++){
				this.data[i][j] -= a.data[i][j];
			}
		}
	}


	static subtract(a, b){
		if (a.rows != b.rows || a.columns != b.columns){
			console.log("Rows and/or columns must be the same in matrix subtraction.");
			return;
		}
		let retMatrix = new Matrix(a.rows, a.columns);
		for (let i = 0; i < a.rows; i++){
			for (let j = 0; j < a.columns; j++){
				retMatrix.data[i][j] = a.data[i][j] - b.data[i][j];
			}
		}
		return retMatrix;
	}

	randomize(){
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.columns; j++){
				this.data[i][j] = Math.random() * 2 - 1;
			}
		}
	}

	normalize(){
		let sumOfOutputs = 0;
		this.data.forEach((a) => {
			sumOfOutputs += a[0];
		});
		this.data.forEach((a) => {
			a[0] /= sumOfOutputs;
		});
	}

	copy(){
		let newMatrix = new Matrix(this.rows, this.columns);
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.columns; j++){
				newMatrix.data[i][j] = this.data[i][j];
			}
		}
		return newMatrix;
	}

	static transpose(inMatrix){
		let nMatrix = new Matrix(inMatrix.columns, inMatrix.rows);
		for (let i = 0; i < nMatrix.rows; i++){
			for (let j = 0; j < nMatrix.columns; j++){
				nMatrix.data[i][j] = this.data[j][i];
			}
		}

		return nMatrix;

	}

	toJSON(){
		return JSON.stringify(this);
	}

	static fromJSON(data){
		if (typeof data == 'string'){
			data = JSON.parse(data);
		}
		let rMatrix = new Matrix(data.rows, data.columns);
		rMatrix.data = data.data;
		return rMatrix;
	}

	//takes in an array arr and outputs a matrix with each element of arr on a different row
	static arrayToMatrix(arr){
		let returnMatrix = new Matrix(arr.length, 1);
		for (let i = 0; i < arr.length; i++){
			returnMatrix.data[i][0] = arr[i];
		}
		return returnMatrix;
	}

	//takes in a matrix mat (must be x by 1 matrix) into an array
	static matrixToArray(mat){
		let newArr = [];
		for (let i = 0; i < mat.rows; i++){
			newArr.push(mat.data[i][0]);
		}
		return newArr;
	}


}
