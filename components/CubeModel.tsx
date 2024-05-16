import React from 'react';
import {RoundedBox} from '@react-three/drei';
import {SpringValue, animated} from '@react-spring/three';

interface CubeModelProps {
  color: SpringValue<string>;
  opacity?: SpringValue<number>;
}
const CubeModel: React.FC<CubeModelProps> = props => {
  return (
    <mesh>
      <RoundedBox
        args={[0.4, 0.4, 0.15]} // Width, height, depth. Default is [1, 1, 1]
        radius={0.1} // Radius of the rounded corners. Default is 0.05
        smoothness={2} // The number of curve segments. Default is 4
        bevelSegments={2} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
        creaseAngle={0.1} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
      >
        <animated.meshPhongMaterial
          color={props.color}
          transparent={true}
          opacity={props.opacity ?? 1}
        />
      </RoundedBox>
    </mesh>
  );
};

export default CubeModel;
