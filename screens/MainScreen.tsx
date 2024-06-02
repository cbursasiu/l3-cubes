import {Canvas} from '@react-three/fiber';
import React, {useRef} from 'react';

import {COLORS} from '../constants';
import {RoundedBox} from '@react-three/drei';
import {
  FlingGestureHandler,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {randInt} from 'three/src/math/MathUtils.js';
import {animated, useSpring} from '@react-spring/three';
import {Animated} from 'react-native';

const MainScreen = () => {
  const colorsNumber = 100;

  const color = useRef(COLORS[randInt(0, colorsNumber - 1)]);

  const [currentColor, colorApi] = useSpring(() => ({
    from: {color: color.current},
    config: {duration: 300},
  }));

  // const active = useSpringValue(false);

  const {scale} = useSpring({scale: 1});

  // const {rotation} = useSpring({rotation: 0});

  // const scRef = useRef(1);

  const [springs, api] = useSpring(
    () => ({
      scale: 1,
      position: [0, 0],
      rotation: [0, 0, 0],
    }),
    [],
  );

  const rot = useRef([0, 0, 0]);

  const flingStart = useRef({pos: [0, 0]});
  const selected = useRef(false);

  const moveGesture = Gesture.Pan()
    .onBegin(event => {
      console.log('onBegin', event);
      flingStart.current.pos = [event.x, event.y];
    })
    .onTouchesCancelled(event => {
      console.log('onTouchesCancelled', event);
      selected.current = false;
    })
    .onEnd((event, success) => {
      if (!selected.current) {
        return;
      }
      selected.current = false;
      const dx = event.x - flingStart.current.pos[0];
      const dy = event.y - flingStart.current.pos[1];
      console.log('success', success);
      console.log('dx', dx, 'dy', dy);
      console.log('rot', rot.current);
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          rot.current[1] += (Math.PI / 180) * 90;
        } else {
          rot.current[1] -= (Math.PI / 180) * 90;
        }
      } else {
        if (dy > 0) {
          rot.current[0] += (Math.PI / 180) * 90;
        } else {
          rot.current[0] -= (Math.PI / 180) * 90;
        }
      }
      // rot.current[0] += (Math.PI / 180) * 90;
      api.start({rotation: [rot.current[0], rot.current[1], rot.current[2]]});
    })
    .cancelsTouchesInView(true)
    .runOnJS(true);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={moveGesture}>
        <Animated.View style={{flex: 1, backgroundColor: 'black'}}>
          <Canvas
            camera={{fov: 10, near: 0.1, far: 100, position: [0, 0, 100]}}>
            <ambientLight intensity={0.4} color={'white'} />
            <directionalLight color="white" position={[3, 3, 7]} />
            <animated.mesh
              scale={scale}
              key={1}
              position={[0, 0, 5]}
              // position={position.pos}
              rotation={springs.rotation.to((x, y, z) => [x, y, z])}
              castShadow
              onPointerDown={() => {
                console.log(
                  'click---------------------------------------------------------',
                );
                selected.current = true;
              }}>
              <RoundedBox
                scale={2}
                args={[1, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
                radius={0.1} // Radius of the rounded corners. Default is 0.05
                smoothness={4} // The number of curve segments. Default is 4
                bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
                creaseAngle={0.1} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
              >
                <animated.meshPhongMaterial color={currentColor.color} />
              </RoundedBox>
            </animated.mesh>
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default MainScreen;
