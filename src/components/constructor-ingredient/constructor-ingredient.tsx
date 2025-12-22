import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredient, WithUniqueId } from '@utils/types';

import styles from './constructor-ingredient.module.css';

type ConstructorIngredientProps = {
  ingredient: WithUniqueId<TIngredient>;
  className: string;
  handleDelete: () => () => void;
  handleMove: (sourceId: string, targetId: string) => void;
};

export const ConstructorIngredient: React.FC<ConstructorIngredientProps> = ({
  ingredient,
  handleDelete,
  handleMove,
  className,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'selectedIngredient',
    item: { id: ingredient.uniqueId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, handlerId }, drop] = useDrop({
    accept: 'selectedIngredient',
    drop(itemId: { id: string }) {
      if (itemId.id !== ingredient.uniqueId) {
        handleMove(itemId.id, ingredient.uniqueId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      handlerId: monitor.getHandlerId(),
    }),
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
      drop(node);
    },
    [drop, drag]
  );

  return (
    <div
      className={`${styles.ingredient_drag} ${className} ${isDragging ? styles.dragging : isOver ? styles.hover : ''}`}
      ref={handleRef}
      data-handler-id={handlerId}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        extraClass={`${styles.ingredient} ml-2`}
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image_mobile}
        handleClose={handleDelete()}
      />
    </div>
  );
};
