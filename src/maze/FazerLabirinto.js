export const geraLabirinto = (x, y) => {
  //20,20
  let n = x * y - 1;

  if (n < 0) {
    alert('illegal maze dimensions');
    return;
  }
  let horiz = [];
  let verti = [];

  for (let j = 0; j < x + 1; j++) horiz[j] = [];
  for (let j = 0; j < x + 1; j++) verti[j] = [];

  let here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
  let path = [here];
  let unvisited = [];
  for (var j = 0; j < x + 2; j++) {
    unvisited[j] = [];
    for (var k = 0; k < y + 1; k++)
      unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j !== here[0] + 1 || k !== here[1] + 1));
  }
  while (0 < n) {
    let potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1],
      [here[0] - 1, here[1]], [here[0], here[1] - 1]];
    let neighbors = [];
    for (let j = 0; j < 4; j++)
      if (unvisited[potential[j][0] + 1][potential[j][1] + 1])
        neighbors.push(potential[j]);
    if (neighbors.length) {
      n = n - 1;
      let next = neighbors[Math.floor(Math.random() * neighbors.length)];
      unvisited[next[0] + 1][next[1] + 1] = false;
      if (next[0] === here[0]) {
        horiz[next[0]][Math.floor((next[1] + here[1] - 1) / 2)] = true;
      } else {
        verti[Math.floor((next[0] + here[0] - 1) / 2)][next[1]] = true;
      }

      path.push(here = next);
    } else
      here = path.pop();
  }
  return { x: x, y: y, horiz: horiz, verti: verti };
};

export const formataLabirinto = (m) => {
  let text = [];
  let height = 0;
  let width = 0;
  for (let j = 0; j < m.x * 2 + 1; j++) {
    let line = [];
    if (0 === j % 2)
      for (let k = 0; k < m.y * 4 + 1; k++)
        if (0 === k % 4)
          line[k] = '*';
        else if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 4)])
          line[k] = '2';
        else
          line[k] = '-';
    else
      for (let k = 0; k < m.y * 4 + 1; k++)
        if (0 === k % 4)
          if (k > 0 && m.horiz[(j - 1) / 2][k / 4 - 1])
            line[k] = ' ';
          else
            line[k] = '*';
        else
          line[k] = '2';
    if (0 === j) line[1] = line[2] = line[3] = '2';
    if (m.x * 2 - 1 === j) line[4 * m.y] = ' ';
    const defineLine = line.join('')
      .replace(new RegExp('222', 'g'), ' ')
      .replace(new RegExp('---', 'g'), '*');
    width = defineLine.length;
    height++;
    text.push(defineLine + '\r\n');
  }
  return {
    start: { x: 1, y: 0 },
    end: { x: width-1, y: height - 2 },
    width: width + 2,
    height: height,
    map: text.join(''),
  };
};
