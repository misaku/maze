export default {
  star:"export function searchAlgorithm(walker) {\n" +
    "  this.context = walker.context;\n" +
    "  this.walker = walker;\n" +
    "  this.grid = walker.visited;\n" +
    "  this.start = new GraphNode(walker.maze.start.x, walker.maze.start.y, GraphNodeType.OPEN);\n" +
    "  this.end = new GraphNode(walker.maze.end.x, walker.maze.end.y, GraphNodeType.OPEN);\n" +
    "  this.diagonal = false;\n" +
    "  this.openHeap = null;\n" +
    "  this.isInit = false;\n" +
    "  this.done = false;\n" +
    "  this.solution = [];\n" +
    "\n" +
    "  this.init = function () {\n" +
    "    for (let x = 0, xl = this.walker.maze.width; x < xl; x++) {\n" +
    "      for (let y = 0, yl = this.walker.maze.height; y < yl; y++) {\n" +
    "        let node = new GraphNode(\n" +
    "          x,\n" +
    "          y,\n" +
    "          (walker.canMove(x, y) ? GraphNodeType.OPEN : GraphNodeType.WALL));\n" +
    "        node.f = 0;\n" +
    "        node.g = 0;\n" +
    "        node.h = 0;\n" +
    "        node.cost = 1;\n" +
    "        node.visited = false;\n" +
    "        node.closed = false;\n" +
    "        node.parent = null;\n" +
    "\n" +
    "        walker.visited[x][y] = node;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    this.start.g = 0;\n" +
    "    this.end.g = 0;\n" +
    "\n" +
    "    this.openHeap = this.heap();\n" +
    "    this.openHeap.push(this.start);\n" +
    "  };\n" +
    "\n" +
    "  this.heap = function () {\n" +
    "    return new BinaryHeap(function (node) {\n" +
    "      return node.f;\n" +
    "    });\n" +
    "  };\n" +
    "\n" +
    "  this.step = function () {\n" +
    "    if (!this.isInit) {\n" +
    "      this.init();\n" +
    "      this.isInit = true;\n" +
    "    }\n" +
    "\n" +
    "    this.search();\n" +
    "  };\n" +
    "\n" +
    "  this.search = function () {\n" +
    "    if (this.openHeap.size() > 0) {\n" +
    "      // PEGUE O MENOR F (X) PARA PROCESSAR A SEGUIR. HEAP MANTÉM ISSO ORGANIZADO PARA NÓS.\n" +
    "      let currentNode = this.openHeap.pop();\n" +
    "\n" +
    "      // CASO FINAL - RESULTADO ENCONTRADO, RETORNE O CAMINHO RASTREADO.\n" +
    "      if (currentNode.x == this.end.x && currentNode.y == this.end.y) {\n" +
    "        let curr = currentNode;\n" +
    "        let ret = [];\n" +
    "        while (curr.parent) {\n" +
    "          ret.push(curr);\n" +
    "          curr = curr.parent;\n" +
    "        }\n" +
    "\n" +
    "        this.done = true;\n" +
    "        this.solution = ret.reverse();\n" +
    "\n" +
    "        return;\n" +
    "      }\n" +
    "\n" +
    "      this.context.fillStyle = 'rgb(255, 0, 0)';\n" +
    "      this.context.fillRect(currentNode.x * 10, currentNode.y * 10, 10, 10);\n" +
    "\n" +
    "      // CASO NORMAL - MOVA O CURRENTNODE DE ABERTO PARA FECHADO, PROCESSE CADA UM DE SEUS VIZINHOS.\n" +
    "      currentNode.closed = true;\n" +
    "\n" +
    "      // ENCONTRE TODOS OS VIZINHOS PARA O NÓ ATUAL. OPCIONALMENTE,\n" +
    "      // ENCONTRE TAMBÉM VIZINHOS DIAGONAIS (FALSO POR PADRÃO).\n" +
    "      let neighbors = this.neighbors(this.grid, currentNode, this.diagonal);\n" +
    "\n" +
    "      for (let i = 0, il = neighbors.length; i < il; i++) {\n" +
    "        let neighbor = neighbors[i];\n" +
    "\n" +
    "        if (neighbor.closed || neighbor.isWall()) {\n" +
    "          // NÃO É UM NÓ VÁLIDO PARA PROCESSAR, PULE PARA O PRÓXIMO VIZINHO.\n" +
    "          continue;\n" +
    "        }\n" +
    "\n" +
    "        // A PONTUAÇÃO G É A MENOR DISTÂNCIA DO INÍCIO AO NÓ ATUAL.\n" +
    "        // PRECISAMOS VERIFICAR SE O CAMINHO QUE CHEGAMOS A ESSE VIZINHO\n" +
    "        // É O MAIS CURTO QUE JÁ VIMOS.\n" +
    "        // INCLUA UM CUSTO ADICIONAL PARA DIAGONAIS PARA AJUDAR NA SUAVIZAÇÃO.\n" +
    "        let gScore = currentNode.g + neighbor.cost + (neighbor.diag ? 2 : 0);\n" +
    "        let beenVisited = neighbor.visited;\n" +
    "\n" +
    "        if (!beenVisited || gScore < neighbor.g) {\n" +
    "          // ENCONTROU UM CAMINHO IDEAL (ATÉ AGORA) PARA ESTE NÓ.\n" +
    "          // FAÇA UMA PONTUAÇÃO NO NÓ PARA VER COMO É BOM.\n" +
    "          neighbor.visited = true;\n" +
    "          neighbor.parent = currentNode;\n" +
    "          neighbor.h = neighbor.h || (this.diagonal ? this.diagonalDistance(\n" +
    "            neighbor.pos,\n" +
    "            this.end.pos) : this.manhattan(neighbor.pos, this.end.pos));\n" +
    "          neighbor.g = gScore;\n" +
    "          neighbor.f = neighbor.g + neighbor.h;\n" +
    "\n" +
    "          if (!beenVisited) {\n" +
    "            // PRESSIONAR PARA HEAP O COLOCARÁ NO LUGAR APROPRIADO COM BASE NO VALOR 'F'.\n" +
    "            this.context.fillStyle = 'rgb(255, 100, 100)';\n" +
    "            this.context.fillRect(neighbor.x * 10, neighbor.y * 10, 10, 10);\n" +
    "\n" +
    "            this.openHeap.push(neighbor);\n" +
    "          } else {\n" +
    "            // JÁ VIU O NÓ, MAS DESDE QUE ELE FOI RESGATADO, PRECISAMOS REORDENÁ-LO NO HEAP\n" +
    "            this.openHeap.rescoreElement(neighbor);\n" +
    "          }\n" +
    "        }\n" +
    "      }\n" +
    "    } else {\n" +
    "      // NÃO HÁ MAIS NÓS. NENHUMA SOLUÇÃO ENCONTRADA.\n" +
    "      this.done = true;\n" +
    "    }\n" +
    "\n" +
    "    // NENHUM RESULTADO FOI ENCONTRADO - A MATRIZ VAZIA SIGNIFICA FALHA AO ENCONTRAR O CAMINHO.\n" +
    "    this.solution = [];\n" +
    "  };\n" +
    "\n" +
    "  this.manhattan = function (pos0, pos1) {\n" +
    "    // VEJA A LISTA DE HEURÍSTICAS: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html\n" +
    "    let d1 = Math.abs(pos1.x - pos0.x);\n" +
    "    let d2 = Math.abs(pos1.y - pos0.y);\n" +
    "\n" +
    "    return d1 + d2;\n" +
    "  };\n" +
    "\n" +
    "  this.diagonalDistance = function (pos0, pos1) {\n" +
    "    // VEJA A LISTA DE HEURÍSTICAS: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html\n" +
    "    let d1 = Math.abs(pos1.x - pos0.x);\n" +
    "    let d2 = Math.abs(pos1.y - pos0.y);\n" +
    "\n" +
    "    return (2 * Math.max(d1, d2));\n" +
    "  };\n" +
    "\n" +
    "  this.neighbors = function (grid, node, diagonals) {\n" +
    "    let ret = [];\n" +
    "    let x = node.x;\n" +
    "    let y = node.y;\n" +
    "\n" +
    "    // OESTE\n" +
    "    if (grid[x - 1] && grid[x - 1][y]) {\n" +
    "      ret.push(grid[x - 1][y]);\n" +
    "    }\n" +
    "\n" +
    "    // LESTE\n" +
    "    if (grid[x + 1] && grid[x + 1][y]) {\n" +
    "      ret.push(grid[x + 1][y]);\n" +
    "    }\n" +
    "\n" +
    "    // SUL\n" +
    "    if (grid[x] && grid[x][y - 1]) {\n" +
    "      ret.push(grid[x][y - 1]);\n" +
    "    }\n" +
    "\n" +
    "    // NORTE\n" +
    "    if (grid[x] && grid[x][y + 1]) {\n" +
    "      ret.push(grid[x][y + 1]);\n" +
    "    }\n" +
    "\n" +
    "    if (diagonals) {\n" +
    "\n" +
    "      // SUDOESTE\n" +
    "      if (grid[x - 1] && grid[x - 1][y - 1]) {\n" +
    "        ret.push(grid[x - 1][y - 1]);\n" +
    "        grid[x - 1][y - 1].diag = true;\n" +
    "      }\n" +
    "\n" +
    "      // SUDESTE\n" +
    "      if (grid[x + 1] && grid[x + 1][y - 1]) {\n" +
    "        ret.push(grid[x + 1][y - 1]);\n" +
    "        grid[x + 1][y - 1].diag = true;\n" +
    "      }\n" +
    "\n" +
    "      // NOROESTE\n" +
    "      if (grid[x - 1] && grid[x - 1][y + 1]) {\n" +
    "        ret.push(grid[x - 1][y + 1]);\n" +
    "        grid[x - 1][y + 1].diag = true;\n" +
    "      }\n" +
    "\n" +
    "      // NORDESTE\n" +
    "      if (grid[x + 1] && grid[x + 1][y + 1]) {\n" +
    "        ret.push(grid[x + 1][y + 1]);\n" +
    "        grid[x + 1][y + 1].diag = true;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    return ret;\n" +
    "  };\n" +
    "\n" +
    "  this.isDone = function () {\n" +
    "    return this.done;\n" +
    "  };\n" +
    "\n" +
    "  this.solve = function () {\n" +
    "    this.context.fillStyle = 'rgb(255, 0, 0)';\n" +
    "\n" +
    "    // PREENCHE O CAMINHO\n" +
    "    for (let i in this.solution) {\n" +
    "      this.context.fillRect(this.solution[i].x * 10, this.solution[i].y * 10, 10, 10);\n" +
    "    }\n" +
    "\n" +
    "    // PREENCHE O CAMINHO INICIAL\n" +
    "    this.context.fillRect(this.walker.maze.start.x * 10, this.walker.maze.start.y * 10, 10, 10);\n" +
    "\n" +
    "    this.isInit = false;\n" +
    "    this.done = false;\n" +
    "  };\n" +
    "};\n" +
    "\n" +
    "let GraphNodeType = { OPEN: 0, WALL: 1 };\n" +
    "\n" +
    "function GraphNode(x, y, type) {\n" +
    "  this.data = {};\n" +
    "  this.x = x;\n" +
    "  this.y = y;\n" +
    "  this.pos = { x: x, y: y };\n" +
    "  this.type = type;\n" +
    "}\n" +
    "\n" +
    "GraphNode.prototype.isWall = function () {\n" +
    "  return this.type == GraphNodeType.WALL;\n" +
    "};\n" +
    "\n" +
    "function BinaryHeap(scoreFunction) {\n" +
    "  this.content = [];\n" +
    "  this.scoreFunction = scoreFunction;\n" +
    "}\n" +
    "\n" +
    "BinaryHeap.prototype = {\n" +
    "  push: function (element) {\n" +
    "    // ADICIONE O NOVO ELEMENTO AO FINAL DA MATRIZ.\n" +
    "    this.content.push(element);\n" +
    "    // DEIXE-O AFUNDAR.\n" +
    "    this.sinkDown(this.content.length - 1);\n" +
    "  },\n" +
    "\n" +
    "  pop: function () {\n" +
    "    // ARMAZENE O PRIMEIRO ELEMENTO PARA QUE POSSAMOS RETORNÁ-LO MAIS TARDE.\n" +
    "    let result = this.content[0];\n" +
    "    // PEGA O ELEMENTO NO FINAL DA MATRIZ.\n" +
    "    let end = this.content.pop();\n" +
    "    // SE AINDA HOUVER ALGUM ELEMENTO, COLOQUE O ELEMENTO FINAL NO\n" +
    "    // COMECE E DEIXE BORBULHAR.\n" +
    "    if (this.content.length > 0) {\n" +
    "      this.content[0] = end;\n" +
    "      this.bubbleUp(0);\n" +
    "    }\n" +
    "    return result;\n" +
    "  },\n" +
    "  remove: function (node) {\n" +
    "\n" +
    "    let i = this.content.indexOf(node);\n" +
    "\n" +
    "    // QUANDO ENCONTRADO, O PROCESSO VISTO EM 'POP' É REPETIDO\n" +
    "    // PARA PREENCHER O BURACO.\n" +
    "    let end = this.content.pop();\n" +
    "    if (i !== this.content.length - 1) {\n" +
    "      this.content[i] = end;\n" +
    "      if (this.scoreFunction(end) < this.scoreFunction(node))\n" +
    "        this.sinkDown(i);\n" +
    "      else\n" +
    "        this.bubbleUp(i);\n" +
    "    }\n" +
    "  },\n" +
    "\n" +
    "  size: function () {\n" +
    "    return this.content.length;\n" +
    "  },\n" +
    "\n" +
    "  rescoreElement: function (node) {\n" +
    "    this.sinkDown(this.content.indexOf(node));\n" +
    "  },\n" +
    "  sinkDown: function (n) {\n" +
    "    // PEGA O ELEMENTO QUE PRECISA SER AFUNDADO.\n" +
    "    let element = this.content[n];\n" +
    "    // QUANDO EM 0, UM ELEMENTO NÃO PODE AFUNDAR MAIS.\n" +
    "    while (n > 0) {\n" +
    "      // CALCULA O ÍNDICE DO ELEMENTO PAI E O BUSCA.\n" +
    "      let parentN = ((n + 1) >> 1) - 1,\n" +
    "        parent = this.content[parentN];\n" +
    "      // TROQUE OS ELEMENTOS SE O PAI FOR MAIOR.\n" +
    "      if (this.scoreFunction(element) < this.scoreFunction(parent)) {\n" +
    "        this.content[parentN] = element;\n" +
    "        this.content[n] = parent;\n" +
    "        // ATUALIZE 'N' PARA CONTINUAR NA NOVA POSIÇÃO.\n" +
    "        n = parentN;\n" +
    "      }\n" +
    "      // ENCONTROU UM PAI QUE É MENOR, NÃO PRECISA SE APROFUNDAR MAIS.\n" +
    "      else {\n" +
    "        break;\n" +
    "      }\n" +
    "    }\n" +
    "  },\n" +
    "\n" +
    "  bubbleUp: function (n) {\n" +
    "    // PROCURE O ELEMENTO ALVO E SUA PONTUAÇÃO.\n" +
    "    let length = this.content.length;\n" +
    "    let element = this.content[n];\n" +
    "    let elemScore = this.scoreFunction(element);\n" +
    "\n" +
    "    while (true) {\n" +
    "      // CALCULA OS ÍNDICES DOS ELEMENTOS FILHOS.\n" +
    "      let child2N = (n + 1) << 1, child1N = child2N - 1;\n" +
    "      // É USADO PARA ARMAZENAR A NOVA POSIÇÃO DO ELEMENTO,\n" +
    "      // CASO EXISTAM.\n" +
    "      let swap = null;\n" +
    "      // SE O PRIMEIRO FILHO EXISTIR (ESTIVER DENTRO DA MATRIZ) ...\n" +
    "      if (child1N < length) {\n" +
    "        // PROCURE E CALCULE SUA PONTUAÇÃO.\n" +
    "        let child1 = this.content[child1N];\n" +
    "        var child1Score = this.scoreFunction(child1);\n" +
    "        // SE A PONTUAÇÃO É MENOR QUE A DO NOSSO ELEMENTO, PRECISAMOS TROCAR.\n" +
    "        if (child1Score < elemScore)\n" +
    "          swap = child1N;\n" +
    "      }\n" +
    "      // FAÇA AS MESMAS VERIFICAÇÕES PARA A OUTRA CRIANÇA.\n" +
    "      if (child2N < length) {\n" +
    "        let child2 = this.content[child2N];\n" +
    "        let child2Score = this.scoreFunction(child2);\n" +
    "        if (child2Score < (swap === null ? elemScore : child1Score))\n" +
    "          swap = child2N;\n" +
    "      }\n" +
    "\n" +
    "      // SE O ELEMENTO PRECISAR SER MOVIDO, TROQUE-O E CONTINUE.\n" +
    "      if (swap !== null) {\n" +
    "        this.content[n] = this.content[swap];\n" +
    "        this.content[swap] = element;\n" +
    "        n = swap;\n" +
    "      }\n" +
    "      // CASO CONTRÁRIO, TERMINAMOS.\n" +
    "      else {\n" +
    "        break;\n" +
    "      }\n" +
    "    }\n" +
    "  },\n" +
    "};\n",
    tremaux:"export function searchAlgorithm(walker) {\n" +
      "\tthis.walker = walker;\n" +
      "\tthis.direction = 0;\n" +
      "\tthis.end = walker.maze.end;\n" +
      "\n" +
      "\tthis.step = function() {\n" +
      "\t\tvar startingDirection = this.direction;\n" +
      "\n" +
      "\t\twhile (!this.walker.move(this.direction)) {\n" +
      "\t\t\t// ENCONTRE UMA PAREDE VIRE A DIREITA.\n" +
      "\t\t\tthis.direction++;\n" +
      "\n" +
      "\t\t\tif (this.direction > 3) {\n" +
      "\t\t\t\tthis.direction = 0;\n" +
      "\t\t\t}\n" +
      "\n" +
      "\t\t\tif (this.direction == startingDirection) {\n" +
      "\t\t\t\t// SE VIRAR UM CIRCULO COMPLETO SEM SENHUM OUTRO CAMINHO HORA DE VOLTAR PARA TRAZ\n" +
      "\t\t\t\twhile (!this.walker.move(this.direction, true)) {\n" +
      "\t\t\t\t\t// ENCONTRE UMA PAREDE VIRE A DIREITA.\n" +
      "\t\t\t\t\tthis.direction++;\n" +
      "\n" +
      "\t\t\t\t\tif (this.direction > 3) {\n" +
      "\t\t\t\t\t\tthis.direction = 0;\n" +
      "\t\t\t\t\t}\n" +
      "\t\t\t\t}\n" +
      "\n" +
      "\t\t\t\tbreak;\n" +
      "\t\t\t}\n" +
      "\t\t}\n" +
      "\n" +
      "\t\tthis.walker.draw();\n" +
      "\t};\n" +
      "\n" +
      "\tthis.isDone = function() {\n" +
      "\t\treturn (walker.x == walker.maze.end.x && walker.y == walker.maze.end.y);\n" +
      "\t};\n" +
      "\n" +
      "\tthis.solve = function() {\n" +
      "\t\t// DESENHA O CAMINHO DA SOLUÇÃO.\n" +
      "\t\tfor (var x = 0; x < this.walker.maze.width; x++) {\n" +
      "\t\t\tfor (var y = 0; y < this.walker.maze.height; y++) {\n" +
      "\t\t\t\tif (this.walker.visited[x][y] == 1) {\n" +
      "\t\t\t\t\tthis.walker.context.fillStyle = 'red';\n" +
      "\t\t\t\t\tthis.walker.context.fillRect(x * 10, y * 10, 10, 10);\n" +
      "\t\t\t\t}\n" +
      "\t\t\t}\n" +
      "\t\t}\n" +
      "\t}\n" +
      "};\n",
    fazerLabirinto:"export const geraLabirinto = (x, y) => {\n" +
      "  //20,20\n" +
      "  let n = x * y - 1;\n" +
      "\n" +
      "  if (n < 0) {\n" +
      "    alert('illegal maze dimensions');\n" +
      "    return;\n" +
      "  }\n" +
      "  let horiz = [];\n" +
      "  let verti = [];\n" +
      "\n" +
      "  for (let j = 0; j < x + 1; j++) horiz[j] = [];\n" +
      "  for (let j = 0; j < x + 1; j++) verti[j] = [];\n" +
      "\n" +
      "  let here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];\n" +
      "  let path = [here];\n" +
      "  let unvisited = [];\n" +
      "  for (var j = 0; j < x + 2; j++) {\n" +
      "    unvisited[j] = [];\n" +
      "    for (var k = 0; k < y + 1; k++)\n" +
      "      unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j !== here[0] + 1 || k !== here[1] + 1));\n" +
      "  }\n" +
      "  while (0 < n) {\n" +
      "    let potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1],\n" +
      "      [here[0] - 1, here[1]], [here[0], here[1] - 1]];\n" +
      "    let neighbors = [];\n" +
      "    for (let j = 0; j < 4; j++)\n" +
      "      if (unvisited[potential[j][0] + 1][potential[j][1] + 1])\n" +
      "        neighbors.push(potential[j]);\n" +
      "    if (neighbors.length) {\n" +
      "      n = n - 1;\n" +
      "      let next = neighbors[Math.floor(Math.random() * neighbors.length)];\n" +
      "      unvisited[next[0] + 1][next[1] + 1] = false;\n" +
      "      if (next[0] === here[0]) {\n" +
      "        horiz[next[0]][Math.floor((next[1] + here[1] - 1) / 2)] = true;\n" +
      "      } else {\n" +
      "        verti[Math.floor((next[0] + here[0] - 1) / 2)][next[1]] = true;\n" +
      "      }\n" +
      "\n" +
      "      path.push(here = next);\n" +
      "    } else\n" +
      "      here = path.pop();\n" +
      "  }\n" +
      "  return { x: x, y: y, horiz: horiz, verti: verti };\n" +
      "};\n" +
      "\n" +
      "export const formataLabirinto = (m) => {\n" +
      "  let text = [];\n" +
      "  let height = 0;\n" +
      "  let width = 0;\n" +
      "  for (let j = 0; j < m.x * 2 + 1; j++) {\n" +
      "    let line = [];\n" +
      "    if (0 === j % 2)\n" +
      "      for (let k = 0; k < m.y * 4 + 1; k++)\n" +
      "        if (0 === k % 4)\n" +
      "          line[k] = '*';\n" +
      "        else if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 4)])\n" +
      "          line[k] = '2';\n" +
      "        else\n" +
      "          line[k] = '-';\n" +
      "    else\n" +
      "      for (let k = 0; k < m.y * 4 + 1; k++)\n" +
      "        if (0 === k % 4)\n" +
      "          if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1])\n" +
      "            line[k] = ' ';\n" +
      "          else\n" +
      "            line[k] = '*';\n" +
      "        else\n" +
      "          line[k] = '2';\n" +
      "    if (0 === j) line[1] = line[2] = line[3] = '2';\n" +
      "    if (m.x * 2 - 1 === j) line[4 * m.y] = ' ';\n" +
      "    const defineLine = line.join('')\n" +
      "      .replace(new RegExp('222', 'g'), ' ')\n" +
      "      .replace(new RegExp('---', 'g'), '*');\n" +
      "    width = defineLine.length;\n" +
      "    height++;\n" +
      "    text.push(defineLine + '\\r\\n');\n" +
      "  }\n" +
      "  return {\n" +
      "    start: { x: 1, y: 0 },\n" +
      "    end: { x: width-1, y: height - 2 },\n" +
      "    width: width + 2,\n" +
      "    height: height,\n" +
      "    map: text.join(''),\n" +
      "  };\n" +
      "};\n",
  walker:"export function walkerManager(context, maze) {\n" +
    "  this.context = context;\n" +
    "  //DADOS DA MATRIZ DO LABIRINTO\n" +
    "  this.maze = maze;\n" +
    "\n" +
    "  //CORDENADAS INICIAIS DO CAMINHO\n" +
    "  this.x = maze.start.x;\n" +
    "  this.y = maze.start.y;\n" +
    "\n" +
    "  //CORDENADAS INICIAIS DE ULTIMA POSICAO\n" +
    "  this.lastX = -1;\n" +
    "  this.lastY = -1;\n" +
    "\n" +
    "  //CRIAÇÃO DA MATRIZ DE CAMINHOS VISITADOS\n" +
    "  this.visited = createArray(this.maze.width, this.maze.height);\n" +
    "\n" +
    "  this.init = function () {\n" +
    "    // LIMPA O ARRAY SETANDO PARA ZERO.\n" +
    "    for (let x = 0; x < this.maze.width; x++) {\n" +
    "      for (let y = 0; y < this.maze.height; y++) {\n" +
    "        this.visited[x][y] = 0;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    // MARCA O INICIO DO CAMINHO\n" +
    "    this.visited[this.x][this.y] = 1;\n" +
    "\n" +
    "    // DESENHA O INICIO DO CAMINHO\n" +
    "    this.draw();\n" +
    "\n" +
    "  };\n" +
    "\n" +
    "  //FUNÇÃO RESPONSAVEL PARA DESENHAR O INICIO DO CAMINHO\n" +
    "  this.draw = function () {\n" +
    "    this.context.fillStyle = 'rgb(255, 100, 100)';\n" +
    "    this.context.fillRect(this.x * 10, this.y * 10, 10, 10);\n" +
    "  };\n" +
    "\n" +
    "  //FUNCAO RESPONSAVEL PARA CAMINHAR E DESENHAR O PERCURSO\n" +
    "  this.move = function (direction, backtrack) {\n" +
    "    var changed = false;\n" +
    "\n" +
    "    //DEFINE CAMINHO ANTIGO\n" +
    "    let oldX = this.x;\n" +
    "    let oldY = this.y;\n" +
    "\n" +
    "    if (backtrack || !this.hasVisited(direction)) {\n" +
    "      // OBTEM AS CORDENADAS NOVAS APOS A MUDANÇA DE CAMINHO\n" +
    "      var point = this.getXYForDirection(direction);\n" +
    "\n" +
    "      // CHECA SE É UM CAMINHO VÁLIDO.\n" +
    "      if (this.canMove(point.x, point.y)) {\n" +
    "        this.x = point.x;\n" +
    "        this.y = point.y;\n" +
    "        changed = true;\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    if (changed) {\n" +
    "      this.context.fillStyle = 'rgb(' + (backtrack ? 100 : 255) + ', 0, 0)';\n" +
    "      this.context.fillRect(oldX * 10, oldY * 10, 10, 10);\n" +
    "\n" +
    "      this.lastX = oldX;\n" +
    "      this.lastY = oldY;\n" +
    "\n" +
    "      // MARCA ESTE BLOCO COMO VISITADO (POSSIVELMENTE DUAS VEZES)\n" +
    "      this.visited[this.x][this.y]++;\n" +
    "\n" +
    "      if (backtrack) {\n" +
    "        // SETA O BLOCO PARA NAO SER VISITADO NOVAMENTE\n" +
    "        this.visited[this.lastX][this.lastY] = 2;\n" +
    "      }\n" +
    "\n" +
    "      if (this.visited[oldX][oldY] == 2 && this.visited[this.x][this.y] == 1) {\n" +
    "        // ENCONTROU UM LADRILHO NÃO MARCADO ENQUANTO RETORNAVA.\n" +
    "        // MARQUE NOSSO ÚLTIMO BLOCO DE VOLTA PARA 1 PARA QUE POSSAMOS VISITÁ-LO\n" +
    "        // NOVAMENTE PARA SAIR DESSE CAMINHO.\n" +
    "        this.visited[oldX][oldY] = 1;\n" +
    "        this.context.fillStyle = 'rgb(255, 0, 0)';\n" +
    "        this.context.fillRect(oldX * 10, oldY * 10, 10, 10);\n" +
    "      }\n" +
    "    }\n" +
    "\n" +
    "    return changed;\n" +
    "  };\n" +
    "\n" +
    "  // FUNÇÃO RESPOSÁVEL PARA VERIFICAR SE O CAMINHO É VÁLIDO\n" +
    "  this.canMove = function (x, y) {\n" +
    "    return (maze.isOpen(x, y) && this.visited[x][y] < 2);\n" +
    "  };\n" +
    "\n" +
    "  this.hasVisited = function (direction) {\n" +
    "    // OBTEM AS CORDENADAS NOVAS APOS A MOVIMENTAÇÃO\n" +
    "    var point = this.getXYForDirection(direction);\n" +
    "\n" +
    "    // VERIFICA SE ESTE PONTO JÁ FOI VISITADO.\n" +
    "    return (this.visited[point.x][point.y] > 0);\n" +
    "  };\n" +
    "\n" +
    "  this.getXYForDirection = function (direction) {\n" +
    "    var point = {};\n" +
    "\n" +
    "    switch (direction) {\n" +
    "      case 0:\n" +
    "        point.x = this.x;\n" +
    "        point.y = this.y - 1;\n" +
    "        break;\n" +
    "      case 1:\n" +
    "        point.x = this.x + 1;\n" +
    "        point.y = this.y;\n" +
    "        break;\n" +
    "      case 2:\n" +
    "        point.x = this.x;\n" +
    "        point.y = this.y + 1;\n" +
    "        break;\n" +
    "      case 3:\n" +
    "        point.x = this.x - 1;\n" +
    "        point.y = this.y;\n" +
    "        break;\n" +
    "    }\n" +
    "    ;\n" +
    "\n" +
    "    return point;\n" +
    "  };\n" +
    "};\n" +
    "\n" +
    "function createArray(length) {\n" +
    "  var arr = new Array(length || 0),\n" +
    "    i = length;\n" +
    "\n" +
    "  if (arguments.length > 1) {\n" +
    "    var args = Array.prototype.slice.call(arguments, 1);\n" +
    "    while (i--) arr[length - 1 - i] = createArray.apply(this, args);\n" +
    "  }\n" +
    "\n" +
    "  return arr;\n" +
    "}\n",
  maze:"//DESENHA CAVAS DO LABIRINTO\n" +
    "export function mazeManager(context, maze){\n" +
    "  this.context = context;\n" +
    "  this.width = maze.width;\n" +
    "  this.height = maze.height;\n" +
    "  this.start = maze.start;\n" +
    "  this.end = maze.end;\n" +
    "  this.maze = maze.map;\n" +
    "\n" +
    "  this.draw = function (drawClear) {\n" +
    "    for (let y = 0; y < this.height; y++) {\n" +
    "      for (let x = 0; x < this.width; x++) {\n" +
    "        if (this.isWall(x, y)) {\n" +
    "          this.context.fillStyle = 'black';\n" +
    "          this.context.fillRect(x * 10, y * 10, 10, 10);\n" +
    "        } else if (drawClear) {\n" +
    "          this.context.fillStyle = 'white';\n" +
    "          this.context.fillRect(x * 10, y * 10, 10, 10);\n" +
    "        }\n" +
    "      }\n" +
    "    }\n" +
    "  };\n" +
    "\n" +
    "  this.isWall = function (x, y) {\n" +
    "    return (x < 0 || y < 0 || this.maze[x + (y * this.width)] === '*');\n" +
    "  };\n" +
    "\n" +
    "  this.isOpen = function (x, y) {\n" +
    "    return !this.isWall(x, y);\n" +
    "  };\n" +
    "};\n"
}
