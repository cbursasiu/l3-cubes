import {Canvas} from '@react-three/fiber';
import React, {useRef} from 'react';

import CubeModel from '../components/CubeModel';
import {COLORS, COLUMNS_COUNT, ROWS_COUNT} from '../constants';
import {RoundedBox, SpotLight} from '@react-three/drei';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Animated} from 'react-native';
import {randInt} from 'three/src/math/MathUtils.js';
import {useSprings} from '@react-spring/native';
import {animated, useSpring} from '@react-spring/three';

const MainScreen = () => {
  const colorsNumber = 100;

  const color = useRef(COLORS[randInt(0, colorsNumber - 1)]);

  const [currentColor, api] = useSpring(() => ({
    from: {color: color.current},
    config: {duration: 300},
  }));

  const [rotation, apiRotation] = useSpring(() => ({
    // from: {rotation: {x: 0, y: 0, z: 0}},
    from: {rotation: {x: 0, y: 0, z: 0}},
    config: {duration: 300},
  }));

  const moveGesture = Gesture.Pan().onEnd(() => {
    color.current = COLORS[randInt(0, colorsNumber - 1)];
    api.start({color: color.current});
  });
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={moveGesture}>
        <Animated.View style={{flex: 1}}>
          <Canvas
            camera={{fov: 10, near: 0.1, far: 100, position: [0, 0, 100]}}>
            <ambientLight intensity={0.4} color={'white'} />
            <directionalLight color="white" position={[3, 3, 7]} />
            {/* <SpotLight
              distance={5}
              angle={0}
              attenuation={2}
              anglePower={5} // Diffuse-cone anglePower (default: 5)
            /> */}
            <animated.mesh
              scale={1}
              key={1}
              position={[0, 0, 5]}
              // style={{rotation: rotation.rotation}}
              rotation={rotation.rotation}
              castShadow
              onClick={() => {
                console.log('click');
                color.current = COLORS[randInt(0, colorsNumber - 1)];
                api.start({color: color.current});
              }}>
              <RoundedBox
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
