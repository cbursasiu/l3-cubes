import React from 'react';
// import {useGeneralStore} from '../stores/mainStore';

interface SelectableMeshComponentProps extends React.ComponentProps<'mesh'> {
  children: React.ReactNode;
  column: number;
  onSelected?: () => void;
}

const SelectableMeshComponent: React.FC<
  SelectableMeshComponentProps
> = props => {
  const {children, onSelected, ...restProps} = props;
  // const selected = useGeneralStore(state => state.selectedCubes[props.column]);

  return (
    <mesh
      // scale={selected ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      onPointerDown={onSelected}
      {...restProps}>
      {children}
    </mesh>
  );
};

export default SelectableMeshComponent;
