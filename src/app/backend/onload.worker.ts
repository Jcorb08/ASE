/// <reference lib="webworker" />
import { Board } from './algorithmX';

addEventListener('message', ({ data }) => {
  //const response = `worker response to ${data}`;
  // run setup in a webworker
  var board = new Board(data[0],data[1])

  // Isn't passing back correctly
  //https://stackoverflow.com/questions/7704323/passing-objects-to-a-web-worker

  // pass array instead??
  postMessage(board);
});
