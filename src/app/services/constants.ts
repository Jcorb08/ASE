// export const STEPS = [1, 2, 3, 4, 5];
// export const ROWS = STEPS[0];
// export const COLS = STEPS.reduce((tmp, itm) => tmp + itm, 0);
export const BLOCK_SIZE = 50;
export const LINES_PER_LEVEL = 2;
export const COLORS = [
  'none',
  'rgba(0, 255, 255)',
  'rgba(0, 0, 255)',
  'rgba(255, 132, 0)',
  'rgba(255, 255, 0)',
  'rgba(0, 255, 0)',
  'rgba(255, 0, 255)',
  'rgba(0, 132, 255)',
  'rgba(255, 132, 255)',
  'rgba(132, 0, 255)',
  'rgba(132, 255, 0)',
  'rgba(0, 255, 132)',
  'rgba(132, 255, 255)'
];
export const COLORSLIGHTER= [
  'none',
  'rgba(132, 255, 255)',
  'rgba(132, 132, 255)',
  'rgba(255, 195, 132)',
  'rgba(255, 255, 132)',
  'rgba(132, 255, 132)',
  'rgba(255, 132, 255)',
  'rgba(255, 132, 132)',
  'rgba(255, 195, 255)',
  'rgba(195, 0, 255)',
  'rgba(195, 255, 132)',
  'rgba(132, 255, 195)',
  'rgba(195, 255, 255)'
];
export const COLORSDARKER= [
  'none',
  'rgba(0, 132, 132)',
  'rgba(0, 0, 132)',
  'rgba(132, 65, 0)',
  'rgba(132, 132, 0)',
  'rgba(0, 132, 0)',
  'rgba(132, 0, 132)',
  'rgba(132, 0, 0)',
  'rgba(255, 65, 255)',
  'rgba(65, 0, 255)',
  'rgba(65, 132, 0)',
  'rgba(0, 132, 65)',
  'rgba(65, 132, 132)'
];
export const SHAPES = [
  [],
  [[1, 1, 1], [1, 0, 1], [0, 0, 0]],
  [[0, 0, 0, 0], [0, 0, 2, 2], [2, 2, 2, 0], [0, 0, 0, 0]],
  [[0, 3, 0], [3, 3, 0], [0, 3, 3]],
  [[0, 4, 0], [4, 4, 4], [0, 0, 0]],
  [[0, 0, 0, 0], [0, 5, 0, 0], [5, 5, 5, 5], [0, 0, 0, 0]],
  [[0, 6, 6], [6, 6, 6], [0, 0, 0]],
  [[0, 7, 7], [7, 7, 0], [0, 0, 0]],
  [[8, 8, 0], [8, 0, 0], [8, 0, 0]],
  [[9, 9, 9], [0, 0, 9], [0, 0, 9]],
  [[0, 0, 0, 0], [10, 0, 0, 0], [10, 10, 10, 10], [0, 0, 0, 0]],
  [[11, 0], [11, 11]],
  [[12, 12, 0], [0, 12, 12], [0, 0, 12], [0, 0, 0]]
];

export class DIR {
  static readonly LEFT = 37;
  static readonly UP = 38;
  static readonly RIGHT = 39;
  static readonly DOWN = 40;
}

export class POINTS {
  static readonly SINGLE = 100;
  static readonly DOUBLE = 300;
  static readonly TRIPLE = 500;
  static readonly TETRIS = 800;
  static readonly SOFT_DROP = 1;
  static readonly HARD_DROP = 2;
}

export class LEVEL {
  static readonly 0 = 800;
  static readonly 1 = 720;
  static readonly 2 = 630;
  static readonly 3 = 550;
  static readonly 4 = 470;
  static readonly 5 = 380;
  static readonly 6 = 300;
  static readonly 7 = 220;
  static readonly 8 = 130;
  static readonly 9 = 100;
  static readonly 10 = 80;
  static readonly 11 = 80;
  static readonly 12 = 80;
  static readonly 13 = 70;
  static readonly 14 = 70;
  static readonly 15 = 70;
  static readonly 16 = 50;
  static readonly 17 = 50;
  static readonly 18 = 50;
  static readonly 19 = 30;
  static readonly 20 = 30;
  // 29+ is 20ms
}
