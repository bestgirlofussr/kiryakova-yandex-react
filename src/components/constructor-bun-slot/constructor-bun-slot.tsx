import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrop } from 'react-dnd';

import { setBun } from '@services/burger-constructor/reducer';
import { useAppDispatch } from '@services/store';

import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './constructor-bun-slot.module.css';

type BunSlotProps = {
  item: TIngredient | null;
  extraClass: string;
  postfix: string;
  position: 'top' | 'bottom';
};

export const ConstructorBunSlot: React.FC<BunSlotProps> = ({
  item,
  extraClass,
  postfix,
  position,
}) => {
  const dispatch = useAppDispatch();
  const [{ isOver }, drop] = useDrop({
    accept: 'bun',
    drop(bun: TIngredient) {
      console.log(bun);
      dispatch(setBun(bun));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop]
  );

  return (
    <div ref={handleRef}>
      {item ? (
        <ConstructorElement
          extraClass={`${extraClass} ${isOver ? styles.drop_target : ''}`}
          type={position}
          isLocked={true}
          text={`${item.name} ${postfix}`}
          price={item.price}
          thumbnail={item.image_mobile}
        />
      ) : (
        <div
          className={`${styles[`bun_${position}`]} ${isOver ? styles.drop_target : ''}`}
        >
          <p className="text text_type_main-default">Выберите булки</p>
        </div>
      )}
    </div>
  );
};
