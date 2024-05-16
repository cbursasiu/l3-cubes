import {Canvas} from '@react-three/fiber';
import React, {useRef} from 'react';

import CubeModel from '../components/CubeModel';
import SelectableMeshComponent from '../components/SelectableMeshComponent';
import {useGeneralStore} from '../stores/mainStore';
import {COLORS, COLUMNS_COUNT, ROWS_COUNT} from '../constants';
import {RoundedBox} from '@react-three/drei';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Animated} from 'react-native';
import {randInt} from 'three/src/math/MathUtils.js';
import {useSpringValue, useSprings} from '@react-spring/native';
import {animated} from '@react-spring/three';

const MainScreen = () => {
  const colorsNumber = 13;
  const topColor = useRef(
    Array(COLUMNS_COUNT)
      .fill(0)
      .map(() => COLORS[randInt(0, colorsNumber - 1)]),
  );
  const [topColors, api] = useSprings(
    COLUMNS_COUNT,
    index => ({
      from: {color: 'white'},
      to: {color: topColor.current[index]},
      config: {duration: 500},
    }),
    [],
  );
  const bottomColor = useRef(
    Array(ROWS_COUNT)
      .fill(0)
      .map((_, row) =>
        Array(COLUMNS_COUNT)
          .fill(0)
          .map(() =>
            row < 4 ? COLORS[randInt(0, colorsNumber - 1)] : '#FFFFFF',
          ),
      ),
  );
  const bottomColorOpacity = useRef(
    Array(ROWS_COUNT)
      .fill(0)
      .map((_, row) =>
        Array(COLUMNS_COUNT)
          .fill(0)
          .map(() => (row < 4 ? 1 : 0.25)),
      ),
  );
  const [bottomColors, bottomApi] = useSprings(
    ROWS_COUNT * COLUMNS_COUNT,
    index => ({
      from: {color: 'white'},
      to: {
        color:
          bottomColor.current[Math.floor(index / COLUMNS_COUNT)][
            index % COLUMNS_COUNT
          ],
      },
      config: {duration: 500},
    }),
    [],
  );
  const [bottomOpacities, bottomOpacityApi] = useSprings(
    ROWS_COUNT * COLUMNS_COUNT,
    index => ({
      from: {opacity: 0},
      to: {
        opacity:
          bottomColorOpacity.current[Math.floor(index / COLUMNS_COUNT)][
            index % COLUMNS_COUNT
          ],
      },
      config: {duration: 500},
    }),
    [],
  );
  const [scale, scaleApi] = useSprings(
    ROWS_COUNT * COLUMNS_COUNT,
    index => ({
      from: {scale: 1},
      to: {
        scale:
          bottomColor.current[Math.floor(index / COLUMNS_COUNT)][
            index % COLUMNS_COUNT
          ] === topColor.current[index % COLUMNS_COUNT]
            ? 1.2
            : 1,
      },
      config: {duration: 500},
    }),
    [],
  );

  // const selectedCubes = Array(COLUMNS_COUNT)
  //   .fill(0)
  //   .map(() => false);
  // const columnCount = COLUMNS_COUNT;

  // const topColor = useGeneralStore(state => state.topColor);
  // const bottomColor = useGeneralStore(state => state.bottomColor);
  const gesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      // useGeneralStore.getState().newLine();
      const oldColors = topColor.current;
      console.log('oldColors', oldColors);
      topColor.current = Array(COLUMNS_COUNT)
        .fill(0)
        .map(() => COLORS[randInt(0, colorsNumber - 1)]);
      api.start(index => ({
        from: {color: oldColors[index]},
        to: {color: topColor.current[index]},
      }));

      const oldBottomColors = bottomColor.current;
      bottomColor.current = Array(ROWS_COUNT)
        .fill(0)
        .map((_, row) =>
          Array(COLUMNS_COUNT)
            .fill(0)
            .map(() =>
              row < 4 ? COLORS[randInt(0, colorsNumber - 1)] : '#FFFFFF',
            ),
        );
      bottomApi.start(index => ({
        from: {
          color:
            oldBottomColors[Math.floor(index / COLUMNS_COUNT)][
              index % COLUMNS_COUNT
            ],
        },
        to: {
          color:
            bottomColor.current[Math.floor(index / COLUMNS_COUNT)][
              index % COLUMNS_COUNT
            ],
        },
      }));
      const oldScale = scale.map(s => s.scale.get());
      scaleApi.start(index => ({
        from: {scale: oldScale[index]},
        to: {
          scale:
            bottomColor.current[Math.floor(index / COLUMNS_COUNT)][
              index % COLUMNS_COUNT
            ] === topColor.current[index % COLUMNS_COUNT]
              ? 1.2
              : 1,
        },
      }));
    });
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{flex: 1}}>
          <Canvas camera={{fov: 75, near: 0.1, far: 10, position: [0, 0, 4]}}>
            <ambientLight intensity={0.4} />
            <directionalLight color="red" position={[0, 0, 5]} />
            {Array.from({length: COLUMNS_COUNT}).map((_, indexX) => (
              <mesh position={[-3 + indexX / 2, 0, -5.15]} key={indexX}>
                <RoundedBox
                  key={indexX}
                  args={[0.44, 13, 0.15]} // Width, height, depth. Default is [1, 1, 1]
                  radius={0.1} // Radius of the rounded corners. Default is 0.05
                  smoothness={2} // The number of curve segments. Default is 4
                  bevelSegments={2} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
                  creaseAngle={0.1} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
                >
                  <animated.meshPhongMaterial
                    color={topColors[indexX].color}
                    transparent={true}
                    opacity={0.25}
                  />
                </RoundedBox>
              </mesh>
            ))}
            {Array.from({length: COLUMNS_COUNT}).map((_, indexX) => (
              <mesh key={indexX} position={[-3 + indexX / 2, 6.0, -5]}>
                <CubeModel color={topColors[indexX].color} />
              </mesh>
            ))}
            {Array.from({length: COLUMNS_COUNT}).map((_, indexX) =>
              Array.from({length: ROWS_COUNT}).map((__, indexY) => (
                <animated.mesh
                  scale={scale[indexY * COLUMNS_COUNT + indexX].scale}
                  //   bottomColor.current[indexY][indexX] ===
                  //   topColor.current[indexX]
                  //     ? [1.2, 1.2, 1.2]r
                  //     : [1, 1, 1]
                  // }
                  key={indexX * COLUMNS_COUNT + indexY}
                  position={[-3 + indexX / 2, -6.0 + indexY / 2, -5]}>
                  <CubeModel
                    color={bottomColors[indexY * COLUMNS_COUNT + indexX].color}
                    opacity={
                      bottomOpacities[indexY * COLUMNS_COUNT + indexX].opacity
                    }
                  />
                </animated.mesh>
              )),
            )}
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default MainScreen;
