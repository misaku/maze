export function walkerManager(context, maze) {
  this.context = context;
  //DADOS DA MATRIZ DO LABIRINTO
  this.maze = maze;

  //CORDENADAS INICIAIS DO CAMINHO
  this.x = maze.start.x;
  this.y = maze.start.y;

  //CORDENADAS INICIAIS DE ULTIMA POSICAO
  this.lastX = -1;
  this.lastY = -1;

  //CRIAÇÃO DA MATRIZ DE CAMINHOS VISITADOS
  this.visited = createArray(this.maze.width, this.maze.height);

  this.init = function () {
    // LIMPA O ARRAY SETANDO PARA ZERO.
    for (let x = 0; x < this.maze.width; x++) {
      for (let y = 0; y < this.maze.height; y++) {
        this.visited[x][y] = 0;
      }
    }

    // MARCA O INICIO DO CAMINHO
    this.visited[this.x][this.y] = 1;

    // DESENHA O INICIO DO CAMINHO
    this.draw();

  };

  //FUNÇÃO RESPONSAVEL PARA DESENHAR O INICIO DO CAMINHO
  this.draw = function () {
    this.context.fillStyle = 'rgb(255, 100, 100)';
    this.context.fillRect(this.x * 10, this.y * 10, 10, 10);
  };

  //FUNCAO RESPONSAVEL PARA CAMINHAR E DESENHAR O PERCURSO
  this.move = function (direction, backtrack) {
    var changed = false;

    //DEFINE CAMINHO ANTIGO
    let oldX = this.x;
    let oldY = this.y;

    if (backtrack || !this.hasVisited(direction)) {
      // OBTEM AS CORDENADAS NOVAS APOS A MUDANÇA DE CAMINHO
      var point = this.getXYForDirection(direction);

      // CHECA SE É UM CAMINHO VÁLIDO.
      if (this.canMove(point.x, point.y)) {
        this.x = point.x;
        this.y = point.y;
        changed = true;
      }
    }

    if (changed) {
      this.context.fillStyle = 'rgb(' + (backtrack ? 100 : 255) + ', 0, 0)';
      this.context.fillRect(oldX * 10, oldY * 10, 10, 10);

      this.lastX = oldX;
      this.lastY = oldY;

      // MARCA ESTE BLOCO COMO VISITADO (POSSIVELMENTE DUAS VEZES)
      this.visited[this.x][this.y]++;

      if (backtrack) {
        // SETA O BLOCO PARA NAO SER VISITADO NOVAMENTE
        this.visited[this.lastX][this.lastY] = 2;
      }

      if (this.visited[oldX][oldY] == 2 && this.visited[this.x][this.y] == 1) {
        // ENCONTROU UM LADRILHO NÃO MARCADO ENQUANTO RETORNAVA.
        // MARQUE NOSSO ÚLTIMO BLOCO DE VOLTA PARA 1 PARA QUE POSSAMOS VISITÁ-LO
        // NOVAMENTE PARA SAIR DESSE CAMINHO.
        this.visited[oldX][oldY] = 1;
        this.context.fillStyle = 'rgb(255, 0, 0)';
        this.context.fillRect(oldX * 10, oldY * 10, 10, 10);
      }
    }

    return changed;
  };

  // FUNÇÃO RESPOSÁVEL PARA VERIFICAR SE O CAMINHO É VÁLIDO
  this.canMove = function (x, y) {
    return (maze.isOpen(x, y) && this.visited[x][y] < 2);
  };

  this.hasVisited = function (direction) {
    // OBTEM AS CORDENADAS NOVAS APOS A MOVIMENTAÇÃO
    var point = this.getXYForDirection(direction);

    // VERIFICA SE ESTE PONTO JÁ FOI VISITADO.
    return (this.visited[point.x][point.y] > 0);
  };

  this.getXYForDirection = function (direction) {
    var point = {};

    switch (direction) {
      case 0:
        point.x = this.x;
        point.y = this.y - 1;
        break;
      case 1:
        point.x = this.x + 1;
        point.y = this.y;
        break;
      case 2:
        point.x = this.x;
        point.y = this.y + 1;
        break;
      case 3:
        point.x = this.x - 1;
        point.y = this.y;
        break;
    }
    ;

    return point;
  };
};

function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}
