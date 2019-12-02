export function searchAlgorithm(walker) {
	this.walker = walker;
	this.direction = 0;
	this.end = walker.maze.end;

	this.step = function() {
		var startingDirection = this.direction;

		while (!this.walker.move(this.direction)) {
			// ENCONTRE UMA PAREDE VIRE A DIREITA.
			this.direction++;

			if (this.direction > 3) {
				this.direction = 0;
			}

			if (this.direction == startingDirection) {
				// SE VIRAR UM CIRCULO COMPLETO SEM SENHUM OUTRO CAMINHO HORA DE VOLTAR PARA TRAZ
				while (!this.walker.move(this.direction, true)) {
					// ENCONTRE UMA PAREDE VIRE A DIREITA.
					this.direction++;

					if (this.direction > 3) {
						this.direction = 0;
					}
				}

				break;
			}
		}

		this.walker.draw();
	};

	this.isDone = function() {
		return (walker.x == walker.maze.end.x && walker.y == walker.maze.end.y);
	};

	this.solve = function() {
		// DESENHA O CAMINHO DA SOLUÇÃO.
		for (var x = 0; x < this.walker.maze.width; x++) {
			for (var y = 0; y < this.walker.maze.height; y++) {
				if (this.walker.visited[x][y] == 1) {
					this.walker.context.fillStyle = 'red';
					this.walker.context.fillRect(x * 10, y * 10, 10, 10);
				}
			}
		}
	}
};
