/// <reference lib="webworker" />
import { Board } from './algorithmX';
import { SearchObject } from './search';
import { buildBoard } from "./buildBoard";

addEventListener('message', ({ data }) => {
  //const response = `worker response to ${data}`;
  // Run solve in a web worker
  var board = new Board(data[0],data[1]);
  var buildboard:buildBoard = new buildBoard(board.getLayers(),board.getBoardLength(),board.getLayersStart());
  board.setBoard(buildboard.buildBoard());
  console.log('board',board.getBoard());
  
  var solutions = (board.solve(data[2],data[3],data[4]) as SearchObject).getSolutions();
  //console.log('worker solutions',solutions);
  
  postMessage(solutions);
});
