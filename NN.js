//MAINLY COPIED FROM THECODINGTRAIN TUTORIAL ON NEURAL NETWORKS!


function sigmoid(x){
	return 1 / (1 + Math.exp(-x));
}

function sigmoidD(x){
	return x * (1 - x);
}

class NeuralNetwork{
	constructor(a, b, c){
		if (a instanceof NeuralNetwork){
			this.inputNodes = a.inputNodes;
			this.hiddenNodes = a.hiddenNodes;
			this.outputNodes = a.outputNodes;

			this.weightsIH = a.weightsIH;
			this.weightsHO = a.weightsHO;
			this.hBias = a.hBias;
			this.oBias = a.oBias;

			this.learningRate = a.learningRate;
		}
		else{
			this.inputNodes = a;
			this.hiddenNodes = b;
			this.outputNodes = c;

			this.weightsIH = new Matrix(this.hiddenNodes, this.inputNodes);
			this.weightsHO = new Matrix(this.outputNodes, this.hiddenNodes);
			this.weightsIH.randomize();
			this.weightsHO.randomize();

			this.hBias = new Matrix(this.hiddenNodes, 1);
			this.oBias = new Matrix(this.outputNodes, 1);

			this.hBias.randomize();
			this.oBias.randomize();

			this.learningRate = 0.1;
		}

	}
	//input must be a Matrix
	predict(input){
		let hidden = Matrix.multiply(this.weightsIH, input);
		hidden = Matrix.add(hidden, this.hBias);
		hidden.map(sigmoid);
		// hidden.data.forEach((a) => {
		// 	a[0] = sigmoid(a[0]);
		// });

		let outputMatrix = Matrix.multiply(this.weightsHO, hidden);
		outputMatrix = Matrix.add(outputMatrix, this.oBias);

		outputMatrix.map(sigmoid);
		// outputMatrix.data.forEach((a) => {
		// 	a[0] = sigmoid(a[0]);
		// });

		outputMatrix.normalize();
		//console.log(outputMatrix);

		let resultArray = [-1, 0];
		for (let i = 0; i < outputMatrix.rows; i++){
			if (outputMatrix.data[i][0] > resultArray[1]){
				resultArray[0] = i;
				resultArray[1] = outputMatrix.data[i][0];
			}
		}
		return resultArray;
	}


	//input and target should both be Matricies
	train(input, target){
		let hidden = Matrix.multiply(this.weightsIH, input);
		hidden = Matrix.add(hidden, this.hBias);
		hidden.map(sigmoid);

		let outputMatrix = Matrix.multiply(this.weightsHO, hidden);
		outputMatrix = Matrix.add(outputMatrix, this.oBias);
		outputMatrix.map(sigmoid);

		outputMatrix.normalize();
		let outputErrors = Matrix.subtract(target, outputMatrix);

		let gradients = Matrix.map(outputMatrix, sigmoidD);
		gradients.multiply(outputErrors);
		gradients.multiply(this.learningRate);

		let hiddenT = Matrix.transpose(hidden);
		let weightHODeltas = Matrix.multiply(gradients, hiddenT);

		this.weightsHO.add(weightHODeltas);
		this.oBias.add(gradients);

		let weightsHOT = Matrix.transpose(this.weightsHO);
		let hiddenErrors = Matrix.multiply(weightsHOT, outputErrors);

		let hiddenGradient = Matrix.map(hidden, sigmoidD);
		hiddenGradient.multiply(hiddenErrors);
		hiddenGradient.multiply(this.learningRate);


		let inputT = Matrix.transpose(input);
		let weightIHDeltas = Matrix.multiply(hiddenGradient, inputT);

		this.weightsIH.add(weightIHDeltas);

		this.hBias.add(hiddenGradient);




	}
	copy(){
		return new NeuralNetwork(this);
	}

	toJSON(){
		return JSON.stringify(this);
	}

	static fromJSON(data){
		if (typeof data == 'string') {
			data = JSON.parse(data);
		}
		let nn = new NeuralNetwork(data.inputNodes, data.hiddenNodes, data.outputNodes);
		nn.weightsIH = Matrix.fromJSON(data.weightsIH);
		nn.weightsHO = Matrix.fromJSON(data.weightsHO);
		nn.hBias = Matrix.fromJSON(data.hBias);
		nn.oBias = Matrix.fromJSON(data.oBias);
		nn.learningRate = data.learningRate;
		return nn;
	}

	mutate(rate) {
		function mutateX(val) {
			if (Math.random() < rate) {
				return val + randomGaussian(0, 0.1);
			} else {
				return val;
			}
		}
		this.weightsIH.map(mutateX);
		this.weightsHO.map(mutateX);
		this.hBias.map(mutateX);
		this.oBias.map(mutateX);
	}


}