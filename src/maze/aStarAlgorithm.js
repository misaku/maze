export function searchAlgorithm(walker) {
  this.context = walker.context;
  this.walker = walker;
  this.grid = walker.visited;
  this.start = new GraphNode(walker.maze.start.x, walker.maze.start.y, GraphNodeType.OPEN);
  this.end = new GraphNode(walker.maze.end.x, walker.maze.end.y, GraphNodeType.OPEN);
  this.diagonal = false;
  this.openHeap = null;
  this.isInit = false;
  this.done = false;
  this.solution = [];

  this.init = function () {
    for (let x = 0, xl = this.walker.maze.width; x < xl; x++) {
      for (let y = 0, yl = this.walker.maze.height; y < yl; y++) {
        let node = new GraphNode(
          x,
          y,
          (walker.canMove(x, y) ? GraphNodeType.OPEN : GraphNodeType.WALL));
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.cost = 1;
        node.visited = false;
        node.closed = false;
        node.parent = null;

        walker.visited[x][y] = node;
      }
    }

    this.start.g = 0;
    this.end.g = 0;

    this.openHeap = this.heap();
    this.openHeap.push(this.start);
  };

  this.heap = function () {
    return new BinaryHeap(function (node) {
      return node.f;
    });
  };

  this.step = function () {
    if (!this.isInit) {
      this.init();
      this.isInit = true;
    }

    this.search();
  };

  this.search = function () {
    if (this.openHeap.size() > 0) {
      // PEGUE O MENOR F (X) PARA PROCESSAR A SEGUIR. HEAP MANTÉM ISSO ORGANIZADO PARA NÓS.
      let currentNode = this.openHeap.pop();

      // CASO FINAL - RESULTADO ENCONTRADO, RETORNE O CAMINHO RASTREADO.
      if (currentNode.x == this.end.x && currentNode.y == this.end.y) {
        let curr = currentNode;
        let ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }

        this.done = true;
        this.solution = ret.reverse();

        return;
      }

      this.context.fillStyle = 'rgb(255, 0, 0)';
      this.context.fillRect(currentNode.x * 10, currentNode.y * 10, 10, 10);

      // CASO NORMAL - MOVA O CURRENTNODE DE ABERTO PARA FECHADO, PROCESSE CADA UM DE SEUS VIZINHOS.
      currentNode.closed = true;

      // ENCONTRE TODOS OS VIZINHOS PARA O NÓ ATUAL. OPCIONALMENTE,
      // ENCONTRE TAMBÉM VIZINHOS DIAGONAIS (FALSO POR PADRÃO).
      let neighbors = this.neighbors(this.grid, currentNode, this.diagonal);

      for (let i = 0, il = neighbors.length; i < il; i++) {
        let neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          // NÃO É UM NÓ VÁLIDO PARA PROCESSAR, PULE PARA O PRÓXIMO VIZINHO.
          continue;
        }

        // A PONTUAÇÃO G É A MENOR DISTÂNCIA DO INÍCIO AO NÓ ATUAL.
        // PRECISAMOS VERIFICAR SE O CAMINHO QUE CHEGAMOS A ESSE VIZINHO
        // É O MAIS CURTO QUE JÁ VIMOS.
        // INCLUA UM CUSTO ADICIONAL PARA DIAGONAIS PARA AJUDAR NA SUAVIZAÇÃO.
        let gScore = currentNode.g + neighbor.cost + (neighbor.diag ? 2 : 0);
        let beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          // ENCONTROU UM CAMINHO IDEAL (ATÉ AGORA) PARA ESTE NÓ.
          // FAÇA UMA PONTUAÇÃO NO NÓ PARA VER COMO É BOM.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || (this.diagonal ? this.diagonalDistance(
            neighbor.pos,
            this.end.pos) : this.manhattan(neighbor.pos, this.end.pos));
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            // PRESSIONAR PARA HEAP O COLOCARÁ NO LUGAR APROPRIADO COM BASE NO VALOR 'F'.
            this.context.fillStyle = 'rgb(255, 100, 100)';
            this.context.fillRect(neighbor.x * 10, neighbor.y * 10, 10, 10);

            this.openHeap.push(neighbor);
          } else {
            // JÁ VIU O NÓ, MAS DESDE QUE ELE FOI RESGATADO, PRECISAMOS REORDENÁ-LO NO HEAP
            this.openHeap.rescoreElement(neighbor);
          }
        }
      }
    } else {
      // NÃO HÁ MAIS NÓS. NENHUMA SOLUÇÃO ENCONTRADA.
      this.done = true;
    }

    // NENHUM RESULTADO FOI ENCONTRADO - A MATRIZ VAZIA SIGNIFICA FALHA AO ENCONTRAR O CAMINHO.
    this.solution = [];
  };

  this.manhattan = function (pos0, pos1) {
    // VEJA A LISTA DE HEURÍSTICAS: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    let d1 = Math.abs(pos1.x - pos0.x);
    let d2 = Math.abs(pos1.y - pos0.y);

    return d1 + d2;
  };

  this.diagonalDistance = function (pos0, pos1) {
    // VEJA A LISTA DE HEURÍSTICAS: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    let d1 = Math.abs(pos1.x - pos0.x);
    let d2 = Math.abs(pos1.y - pos0.y);

    return (2 * Math.max(d1, d2));
  };

  this.neighbors = function (grid, node, diagonals) {
    let ret = [];
    let x = node.x;
    let y = node.y;

    // OESTE
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }

    // LESTE
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }

    // SUL
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }

    // NORTE
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }

    if (diagonals) {

      // SUDOESTE
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1]);
        grid[x - 1][y - 1].diag = true;
      }

      // SUDESTE
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1]);
        grid[x + 1][y - 1].diag = true;
      }

      // NOROESTE
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1]);
        grid[x - 1][y + 1].diag = true;
      }

      // NORDESTE
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1]);
        grid[x + 1][y + 1].diag = true;
      }
    }

    return ret;
  };

  this.isDone = function () {
    return this.done;
  };

  this.solve = function () {
    this.context.fillStyle = 'rgb(255, 0, 0)';

    // PREENCHE O CAMINHO
    for (let i in this.solution) {
      this.context.fillRect(this.solution[i].x * 10, this.solution[i].y * 10, 10, 10);
    }

    // PREENCHE O CAMINHO INICIAL
    this.context.fillRect(this.walker.maze.start.x * 10, this.walker.maze.start.y * 10, 10, 10);

    this.isInit = false;
    this.done = false;
  };
};

let GraphNodeType = { OPEN: 0, WALL: 1 };

function GraphNode(x, y, type) {
  this.data = {};
  this.x = x;
  this.y = y;
  this.pos = { x: x, y: y };
  this.type = type;
}

GraphNode.prototype.isWall = function () {
  return this.type == GraphNodeType.WALL;
};

function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function (element) {
    // ADICIONE O NOVO ELEMENTO AO FINAL DA MATRIZ.
    this.content.push(element);
    // DEIXE-O AFUNDAR.
    this.sinkDown(this.content.length - 1);
  },

  pop: function () {
    // ARMAZENE O PRIMEIRO ELEMENTO PARA QUE POSSAMOS RETORNÁ-LO MAIS TARDE.
    let result = this.content[0];
    // PEGA O ELEMENTO NO FINAL DA MATRIZ.
    let end = this.content.pop();
    // SE AINDA HOUVER ALGUM ELEMENTO, COLOQUE O ELEMENTO FINAL NO
    // COMECE E DEIXE BORBULHAR.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function (node) {

    let i = this.content.indexOf(node);

    // QUANDO ENCONTRADO, O PROCESSO VISTO EM 'POP' É REPETIDO
    // PARA PREENCHER O BURACO.
    let end = this.content.pop();
    if (i !== this.content.length - 1) {
      this.content[i] = end;
      if (this.scoreFunction(end) < this.scoreFunction(node))
        this.sinkDown(i);
      else
        this.bubbleUp(i);
    }
  },

  size: function () {
    return this.content.length;
  },

  rescoreElement: function (node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function (n) {
    // PEGA O ELEMENTO QUE PRECISA SER AFUNDADO.
    let element = this.content[n];
    // QUANDO EM 0, UM ELEMENTO NÃO PODE AFUNDAR MAIS.
    while (n > 0) {
      // CALCULA O ÍNDICE DO ELEMENTO PAI E O BUSCA.
      let parentN = ((n + 1) >> 1) - 1,
        parent = this.content[parentN];
      // TROQUE OS ELEMENTOS SE O PAI FOR MAIOR.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // ATUALIZE 'N' PARA CONTINUAR NA NOVA POSIÇÃO.
        n = parentN;
      }
      // ENCONTROU UM PAI QUE É MENOR, NÃO PRECISA SE APROFUNDAR MAIS.
      else {
        break;
      }
    }
  },

  bubbleUp: function (n) {
    // PROCURE O ELEMENTO ALVO E SUA PONTUAÇÃO.
    let length = this.content.length;
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);

    while (true) {
      // CALCULA OS ÍNDICES DOS ELEMENTOS FILHOS.
      let child2N = (n + 1) << 1, child1N = child2N - 1;
      // É USADO PARA ARMAZENAR A NOVA POSIÇÃO DO ELEMENTO,
      // CASO EXISTAM.
      let swap = null;
      // SE O PRIMEIRO FILHO EXISTIR (ESTIVER DENTRO DA MATRIZ) ...
      if (child1N < length) {
        // PROCURE E CALCULE SUA PONTUAÇÃO.
        let child1 = this.content[child1N];
        var child1Score = this.scoreFunction(child1);
        // SE A PONTUAÇÃO É MENOR QUE A DO NOSSO ELEMENTO, PRECISAMOS TROCAR.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // FAÇA AS MESMAS VERIFICAÇÕES PARA A OUTRA CRIANÇA.
      if (child2N < length) {
        let child2 = this.content[child2N];
        let child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score))
          swap = child2N;
      }

      // SE O ELEMENTO PRECISAR SER MOVIDO, TROQUE-O E CONTINUE.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // CASO CONTRÁRIO, TERMINAMOS.
      else {
        break;
      }
    }
  },
};
