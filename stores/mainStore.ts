import {create} from 'zustand';
import {COLORS, COLUMNS_COUNT, ROWS_COUNT} from '../constants';
import {randInt} from 'three/src/math/MathUtils.js';

interface GeneralStoreInterface {
  colorsNumber: number;
  topColor: string[];
  bottomColor: (string | null)[][];
  selectedCubes: boolean[];
  columnCount: number;
  setSelected: (column: number) => void;
  setColumnCount: (columnCount: number) => void;
  initLevel: (levelNumber: number) => void;
  newLine: () => void;
}

export const useGeneralStore = create<GeneralStoreInterface>(set => ({
  colorsNumber: 13,
  topColor: Array(COLUMNS_COUNT)
    .fill(0)
    .map(() => 'red'),
  bottomColor: Array(ROWS_COUNT)
    .fill(0)
    .map(() =>
      Array(COLUMNS_COUNT)
        .fill(0)
        .map(() => null),
    ),
  selectedCubes: Array(COLUMNS_COUNT)
    .fill(0)
    .map(() => false),
  columnCount: COLUMNS_COUNT,
  setSelected: (column: number) =>
    set(state => {
      const selected = state.selectedCubes.findIndex(sel => sel);
      const topColor =
        selected !== -1 && selected !== column
          ? Array(COLUMNS_COUNT)
              .fill(0)
              .map((_, i) => {
                return i === selected
                  ? state.topColor[column]
                  : i === column
                  ? state.topColor[selected]
                  : state.topColor[i];
              })
          : state.topColor;
      return {
        selectedCubes: Array(state.columnCount)
          .fill(0)
          .map((_, i) => (i === column ? !state.selectedCubes[i] : false)),
        topColor,
      };
    }),
  setColumnCount: (columnCount: number) =>
    set({
      selectedCubes: Array(columnCount)
        .fill(0)
        .map(() => false),
      columnCount,
    }),
  initLevel: (levelNumber: number) => {
    const colorsNumber = Math.min(5 + levelNumber * 2, COLORS.length);
    const initialRows = Math.min(3 + levelNumber, Math.floor(ROWS_COUNT / 3));
    console.log('initialRows', initialRows);
    const topColor = Array(COLUMNS_COUNT)
      .fill(0)
      .map(() => COLORS[randInt(0, colorsNumber - 1)]);
    const bottomColor = Array(ROWS_COUNT)
      .fill(0)
      .map((_, row) =>
        Array(COLUMNS_COUNT)
          .fill(0)
          .map(() =>
            row < initialRows ? COLORS[randInt(0, colorsNumber - 1)] : null,
          ),
      );
    const selectedCubes = Array(COLUMNS_COUNT)
      .fill(0)
      .map(() => false);
    set({
      colorsNumber,
      topColor,
      bottomColor,
      selectedCubes,
    });
  },
  newLine: () => {
    set(state => {
      const topColor = state.topColor.map(
        () => COLORS[randInt(0, state.colorsNumber - 1)],
      );
      const selectedCubes = Array(COLUMNS_COUNT)
        .fill(0)
        .map(() => false);
      const removeCube = Array(COLUMNS_COUNT)
        .fill(0)
        .map((_, col) => {
          for (let row = 0; row < ROWS_COUNT; row++) {
            if (state.bottomColor[row][col] === state.topColor[col]) {
              return true;
            }
          }
          return false;
        });
      let bottomColor = Array(ROWS_COUNT)
        .fill(0)
        .map((_, row) =>
          Array(COLUMNS_COUNT)
            .fill(0)
            .map((__, column) => {
              return state.bottomColor[row][column] === null &&
                (row === 0 || state.bottomColor[row - 1][column] != null)
                ? state.topColor[column]
                : state.bottomColor[row][column];
            }),
        );
      bottomColor = bottomColor.map((row, _rowIdx) => {
        return row.map((column, columnIdx) => {
          return column === state.topColor[columnIdx]
            ? removeCube[columnIdx]
              ? null
              : column
            : column;
        });
      });

      return {
        ...state,
        selectedCubes,
        topColor,
        bottomColor,
      };
    });
  },
}));
