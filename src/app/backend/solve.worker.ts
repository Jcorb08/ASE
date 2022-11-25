/// <reference lib="webworker" />
import { Board } from './algorithmX';

addEventListener('message', ({ data }) => {
  //const response = `worker response to ${data}`;
  // Run solve in a web worker
  postMessage((data[0] as Board).solve(data[1],data[2],data[3]));
});
