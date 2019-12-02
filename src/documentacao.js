import React from 'react';
import { Form, Row, Col, Button, Card, Accordion, InputGroup, Tabs, Tab } from 'react-bootstrap';
import roseta from './img/gerando.gif';
import star from './img/star.gif';
import trema from './img/Tremaux.gif';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DOC from './maze';

export default function Documentacao() {

  return (
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Clique para mais informações
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <br/>
            <br/>
            <h4>Aplicação </h4>
            <Row>
              <Col>
                <p>A aplicção foi baseada em codigos de bibliotecas opensource e desenvolvida em React JS,  consiste nas seguintes etapas:</p>
                <ol>
                  <li><strong>Roseta</strong> - Cria o Labirinto</li>
                  <li><strong>Maze</strong> - Imprime o Labirinto</li>
                  <li><strong>Walker</strong> - Classe Responsável para caminhar no labirinto</li>
                  <li><strong>Star</strong> - Classe com o algoritimo de busca em estrela</li>
                  <li><strong>Tremaux</strong> - Classe com o algoritimo de busca da mão direita</li>
                </ol>
                <p>
                  Primeiramente a aplicação chama o Roseta para criar o labirinto,
                  após isso ela processa com o maze para poder imprimir na tela.
                </p>
                <p>
                  Ao definir o algoritimo de busca que será utilizado é passado juntamente com ele
                  a classe de Walker para que ele possa utilizar para poder caminhar
                </p>
                <p>
                  <strong>Referencia: </strong>[<a href={"https://en.wikipedia.org/wiki/Maze_solving_algorithm"} target={"blank"}>Resolução</a>, <a href={"https://github.com/primaryobjects/maze"} target={"blank"}>primaryobjects</a>]
                </p>

              </Col>
            </Row>
            <br/>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Clique para ver o código: Walker
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <SyntaxHighlighter language="javascript" style={dark}>
                      {DOC.walker}
                    </SyntaxHighlighter>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Clique para ver o código: Maze
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <SyntaxHighlighter language="javascript" style={dark}>
                      {DOC.maze}
                    </SyntaxHighlighter>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <br/>
            <hr/>
                <br/>
                <h4>Algoritmo Roseta </h4>
                <Row>
                  <Col>
                    <p>Gera e mostra um labirinto, usando o algoritmo simples de busca
                      profundidade-primeiro.</p>
                    <p>Começa em uma célula aleatória.</p>
                    <p>Marca a célula atual como visitada e obtenha uma lista de seus vizinhos.
                      Para
                      cada vizinho, começando com um vizinho selecionado aleatoriamente.</p>
                    <p>Se esse vizinho não tiver sido visitado, remova a parede entre essa célula
                      e
                      esse vizinho e recursivo com esse vizinho como a célula atual.</p>
                    <p>
                      <strong>Referencia: </strong>[<a href={"https://rosettacode.org/wiki/Maze_generation#JavaScript"} target={"blank"}>Roseta</a>]
                    </p>
                  </Col>
                  <img src={roseta}/>
                </Row>
            <br/>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Clique para ver o código
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <SyntaxHighlighter language="javascript" style={dark}>
                      {DOC.fazerLabirinto}
                    </SyntaxHighlighter>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
                <br/>
                <hr/>
                <br/>

                <h4>Algoritmo Tremaux (mão direita)</h4>
                <Row>
                  <Col>
                    <p>O algoritmo Tremaux (mão direita) é realmente semelhante a percorrer um
                      labirinto. Somente os blocos imediatos visíveis para você podem ser
                      seguidos.</p>
                    <p>Começa em uma direção aleatória e continua até atingir uma parede. Em
                      seguida,
                      vira à direita, até que um caminho esteja disponível para caminhar. Cada vez
                      que
                      o algoritmo dá um passo, marca o bloco como visitado.</p>
                    <p>O algoritmo sempre tenta primeiro visitar um bloco não visitado. No
                      entanto, se
                      nenhum bloco novo for encontrado, ele retornará ao bloco visitado.</p>
                    <p>Ele nunca visitará o mesmo bloco mais do que duas vezes (com a única
                      exceção se
                      o algoritmo estiver travado em um beco sem saída, nesse caso, ele voltará a
                      visitar um bloco que já foi recuado, a fim de sair da armadilha).</p>
                    <p>A solução do labirinto são todos os blocos que foram visitados uma vez.</p>
                    <p>
                      <strong>Referencia: </strong>[<a href={"https://en.wikipedia.org/wiki/Maze_solving_algorithm#Tr.C3.A9maux.27s_algorithm"} target={"blank"}>Tremaux</a>]
                    </p>
                  </Col>
                  <img src={trema}/>
                </Row>
            <br/>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Clique para ver o código
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <SyntaxHighlighter language="javascript" style={dark}>
                      {DOC.tremaux}
                    </SyntaxHighlighter>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
                <br/>
                <hr/>
                <br/>
                <h4>Algoritmo A* Search (estrela)</h4>
                <Row>
                  <Col>
                    <p>Uma pesquisa * (estrela) é semelhante a ter uma vista aérea do labirinto
                      antes
                      de atravessá-lo. Ele usa o ponto final do labirinto para calcular uma
                      pontuação
                      de cada bloco vizinho. Inteligentemente percorre vários caminhos,
                      aparentemente
                      ao mesmo tempo, até chegar ao fim.</p>
                    <p>Você não seria capaz de usar esse algoritmo se estivesse atravessando
                      fisicamente o labirinto. Pelo menos, não é fácil.</p>
                    <p>
                      <strong>Referencia: </strong>[<a href={"https://en.wikipedia.org/wiki/A*_search_algorithm"} target={"blank"}>A* Search</a>]
                    </p>
                  </Col>
                  <img src={star}/>
                </Row>
            <br/>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Clique para ver o código
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <SyntaxHighlighter language="javascript" style={dark}>
                      {DOC.star}
                    </SyntaxHighlighter>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
