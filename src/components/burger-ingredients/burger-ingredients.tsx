import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import {
  getSelectedIngredient,
  resetSelectedIngredient,
} from '@services/burger-ingredient/reducer';
import { getIngredients } from '@services/burger-ingredients/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';
import { type IngredientType, INGREDIENT_TYPES } from '@utils/types';

import type React from 'react';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const [selectedType, setSelectedType] = useState<IngredientType>(INGREDIENT_TYPES.BUN);

  const ingredients = useAppSelector(getIngredients);
  const selectedIngredient = useAppSelector(getSelectedIngredient);

  const dispatch = useAppDispatch();

  const ingredientTabs: {
    name: string;
    type: IngredientType;
    order: number;
  }[] = useMemo(
    () => [
      {
        name: 'Булки',
        type: INGREDIENT_TYPES.BUN,
        order: 0,
      },
      {
        name: 'Соусы',
        type: INGREDIENT_TYPES.SAUCE,
        order: 1,
      },
      {
        name: 'Начинки',
        type: INGREDIENT_TYPES.MAIN,
        order: 2,
      },
    ],
    []
  );

  const sortedGroups = useMemo(
    () =>
      ingredientTabs.map((tab) => ({
        ...tab,
        items: ingredients.filter((ingredient) => ingredient.type === tab.type),
      })),
    [ingredients]
  );

  const selectMenu = useCallback((type: IngredientType) => {
    setSelectedType(type);
    const element = document.getElementById(`menu_${type}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const ingredientsRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  useEffect(() => {
    const container = ingredientsRef.current;
    if (!container) return;

    const handleScroll = (): void => {
      const headers = Array.from(Object.values(headerRefs.current));

      if (headers.length === 0) return;

      const containerTop = container.getBoundingClientRect().top;

      const closest = headers.reduce(
        (closest, header) =>
          Math.abs(header!.getBoundingClientRect().top - containerTop) <
          Math.abs(closest!.getBoundingClientRect().top - containerTop)
            ? header
            : closest,
        headers[0]
      );

      setSelectedType(closest!.id.replace('menu_', '') as IngredientType);
    };
    container.addEventListener('scroll', handleScroll);

    return (): void => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav className="mb-10">
          <ul className={styles.menu}>
            {ingredientTabs.map((tab) => (
              <Tab
                key={tab.order}
                value={tab.type}
                active={tab.type === selectedType}
                onClick={() => selectMenu(tab.type)}
              >
                {tab.name}
              </Tab>
            ))}
          </ul>
        </nav>
        <div className={styles.ingredients_container}>
          <div className={styles.ingredients_wrapper} ref={ingredientsRef}>
            {sortedGroups.map((tab) => (
              <div key={tab.order} className="mb-10">
                <h2
                  ref={(el) => {
                    headerRefs.current[tab.type] = el;
                  }}
                  id={`menu_${tab.type}`}
                  className="text text_type_main-medium mb-6"
                >
                  {tab.name}
                </h2>
                <div className={styles.ingredients}>
                  {tab.items.map((item) => (
                    <BurgerIngredient key={item._id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {!!selectedIngredient && (
        <Modal
          header="Детали ингредиента"
          isOpen={!!selectedIngredient}
          onClose={() => dispatch(resetSelectedIngredient())}
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
