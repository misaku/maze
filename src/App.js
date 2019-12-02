import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useEffect, useState } from 'react';
import { Form, Row, Col, Button,  Card, InputGroup } from 'react-bootstrap';
import './App.css';
import { formataLabirinto, geraLabirinto } from './maze/FazerLabirinto';
import { mazeManager } from './maze/maze';
import { walkerManager } from './maze/walker';
import { searchAlgorithm as AlgorithmB } from './maze/aStarAlgorithm';
import { searchAlgorithm as AlgorithmA } from './maze/tremauxAlgorithm';
import Documentacao from './documentacao'

function App() {
  const ALGORITIMOS = [AlgorithmA, AlgorithmB];
  const canvas = useRef(null);
  const [largura, setLargura] = useState(10);
  const [altura, setAltura] = useState(10);
  const [algoritimo, setAlgoritimo] = useState(0);

  let context = null;
  const [maze, setMaze] = useState(formataLabirinto(geraLabirinto(10, 10)));
  const [disable, setDisable] = useState(false);
  let walker = null;
  let algorithm = [];
  let speed = null;


  const init = function (maze) {
    setDisable(false);
    context = canvas.current.getContext('2d');
    // Auto-adjust canvas size to fit window.
    canvas.current.width = maze.width * 10;
    canvas.current.height = maze.height * 10;

    // Initialize speed.
    speed = maze.speed == null ? 50 : maze.speed;
    // Create maze.
    maze = new mazeManager(context, maze);
    maze.draw();

    // Create walker at starting position.
    walker = new walkerManager(context, maze);
    walker.init();

    // Initialize the maze algorithm.
    algorithm = new ALGORITIMOS[algoritimo](walker);
  };
  const run = function () {
    if (algorithm.isDone && !algorithm.isDone()) {
      setDisable(true);
      algorithm.step();

      window.setTimeout(function () {
        run();
      }, speed);
    } else {
      if (algorithm.isDone) {
        setDisable(false);
        // Clear map so we can draw the solution path.
        walker.maze.draw(true);
        // Draw the solution path.
        algorithm.solve();
      } else {

      }
    }
  };
  const prePareChange = (event, func) => {
    let valor = event.target.value * 1;
    if (valor <= 0)
      valor = 1;
    return func(valor);
  };
  useEffect(() => init(maze), [maze, algoritimo]);
  const gerar = () => {
    const myMaze = formataLabirinto(geraLabirinto(altura, largura));
    setMaze(myMaze);
  };

  return (
    <div className={'App'}>
      <Card className={'myForm'}>
        <Card.Body>
          <Form>
            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Labirinto:
              </Form.Label>
              <Col sm={10}>
                <Form.Row>
                  <Col>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">Altura</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="number"
                        placeholder="Altura"
                        name="altura"
                        value={altura}
                        onChange={event => prePareChange(event, setAltura)}
                      />
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">Largura</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="number"
                        placeholder="largura"
                        name="largura"
                        value={largura}
                        onChange={event => prePareChange(event, setLargura)}
                      />
                    </InputGroup>
                  </Col>

                  <Button type="button" onClick={gerar} disabled={disable}>GERAR LABIRINTO</Button>

                </Form.Row>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalPassword">
              <Form.Label column sm={2}>
                Algoritimo:
              </Form.Label>
              <Col sm={10}>
                <Form.Row>
                  <Col>
                    <Form.Control as="select" value={algoritimo}
                                  disabled={disable}
                                  onChange={e => setAlgoritimo(e.target.value)}>
                      <option value={0}>Trémaux's (Mão direita)</option>
                      <option value={1}>A* search (Estrela)</option>
                    </Form.Control>
                  </Col>
                  <Button type="button" onClick={run} disabled={disable}>RESOLVER</Button>
                </Form.Row>
              </Col>
            </Form.Group>
          </Form>
          <Documentacao/>
        </Card.Body>
      </Card>
      <div className={'ContentCanvas'}>
        <div className={'moldCanvas'}>
          <canvas ref={canvas}/>
        </div>
      </div>
    </div>
  );
}

export default App;
