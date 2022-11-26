/// <reference lib="webworker" />
import { Board } from './algorithmX';

addEventListener('message', ({ data }) => {
  //const response = `worker response to ${data}`;
  // Run solve in a web worker
  var board = new Board(data[0],data[1]);
  board.setBoard(board.buildBoard());
  var solutions = board.solve(data[2],data[3],data[4]).getSolutions();
  console.log('worker solutions',solutions);
  
  postMessage(solutions);
});
