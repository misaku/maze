# Instalação
### CLONAR REPOSITORIO
```JS
git clone https://github.com/misaku/maze.git
```
### INSTALAR E EXECUTAR MODO DEBUG
* VIA NPM
```BASH
npm install
npm start
```
* VIA YARN
```BASH
yarn
yarn start
```
### BUILDANDO E RODANDO MODO PRODUÇÃO
* VIA NPM
```BASH
npm build
npm install -g serve
npm serve -s build
```
* VIA YARN
```BASH
yarn build
yarn global add serve
yarn serve -s build
```
# Aplicação 
A aplicção foi baseada em codigos de bibliotecas opensource e desenvolvida em React JS,  consiste nas seguintes etapas:
* __Roseta__ - Cria o Labirinto
* __Maze__ - Imprime o Labirinto
* __Walker__ - Classe Responsável para caminhar no labirinto
* __Star__ - Classe com o algoritimo de busca em estrela
* __Tremaux__ - Classe com o algoritimo de busca da mão direita

Primeiramente a aplicação chama o Roseta para criar o labirinto,  após isso ela processa com o maze para poder imprimir na tela.

Ao definir o algoritimo de busca que será utilizado é passado juntamente com ele a classe de Walker para que ele possa utilizar para poder caminhar

__Referencia:__ 
[[primaryobjects](https://en.wikipedia.org/wiki/Maze_solving_algorithm)]

## Algoritmo Roseta

Gera e mostra um labirinto, usando o algoritmo simples de busca profundidade-primeiro.

Começa em uma célula aleatória.

Marca a célula atual como visitada e obtenha uma lista de seus vizinhos. Para cada vizinho, começando com um vizinho selecionado aleatoriamente.

Se esse vizinho não tiver sido visitado, remova a parede entre essa célula e esse vizinho e recursivo com esse vizinho como a célula atual.

__Referencia:__ [[Roseta](https://rosettacode.org/wiki/Maze_generation#JavaScript)]

## Algoritmo Tremaux (mão direita)

O algoritmo Tremaux (mão direita) é realmente semelhante a percorrer um labirinto. Somente os blocos imediatos visíveis para você podem ser seguidos.

Começa em uma direção aleatória e continua até atingir uma parede. Em seguida, vira à direita, até que um caminho esteja disponível para caminhar. Cada vez que o algoritmo dá um passo, marca o bloco como visitado.

O algoritmo sempre tenta primeiro visitar um bloco não visitado. No entanto, se nenhum bloco novo for encontrado, ele retornará ao bloco visitado.
                      
Ele nunca visitará o mesmo bloco mais do que duas vezes (com a única exceção se o algoritmo estiver travado em um beco sem saída, nesse caso, ele voltará a visitar um bloco que já foi recuado, a fim de sair da armadilha).
                    
A solução do labirinto são todos os blocos que foram visitados uma vez.

__Referencia:__ [[Tremaux](https://en.wikipedia.org/wiki/Maze_solving_algorithm#Tr.C3.A9maux.27s_algorithm)]
                    
## Algoritmo A* Search

Uma pesquisa * (estrela) é semelhante a ter uma vista aérea do labirinto antes de atravessá-lo. Ele usa o ponto final do labirinto para calcular uma pontuação de cada bloco vizinho. Inteligentemente percorre vários caminhos, aparentemente ao mesmo tempo, até chegar ao fim.                    
                      
Você não seria capaz de usar esse algoritmo se estivesse atravessando fisicamente o labirinto. Pelo menos, não é fácil.

__Referencia:__ [[A* Search](https://en.wikipedia.org/wiki/A*_search_algorithm)]
