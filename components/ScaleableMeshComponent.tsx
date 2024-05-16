import React from 'react';
import {useGeneralStore} from '../stores/mainStore';

interface ScaleableMeshComponentProps extends React.ComponentProps<'mesh'> {
  children: React.ReactNode;
  column: number;
}

const ScaleableMeshComponent: React.FC<ScaleableMeshComponentProps> = props => {
  const {children, ...restProps} = props;
  const selected = useGeneralStore(state => state.selectedCubes[props.column]);

  return (
    <mesh scale={selected ? [1.2, 1.2, 1.2] : [1, 1, 1]} {...restProps}>
      {children}
    </mesh>
  );
};

export default ScaleableMeshComponent;
