import { Price } from '@/components/ui/price/price';
import { Counter, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useMemo, useCallback } from 'react';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import {
  type TIngredient,
  type IngredientType,
  type WithUniqueId,
  INGREDIENT_TYPES,
} from '@utils/types';

import type React from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  selectedIngredients: WithUniqueId<TIngredient>[];
  addIngredient: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  selectedIngredients,
  //addIngredient,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [selectedType, setSelectedType] = useState<IngredientType>(INGREDIENT_TYPES.BUN);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

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

  const getIngredientCount = useCallback(
    (ingredientId: string) => {
      return selectedIngredients.filter((item) => item._id === ingredientId).length;
    },
    [selectedIngredients]
  );

  const renderCounter = useCallback((count: number) => {
    return count > 0 ? <Counter count={count} /> : null;
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
          <div className={styles.ingredients_wrapper}>
            {sortedGroups.map((tab) => (
              <div key={tab.order} className="mb-10">
                <h2 id={`menu_${tab.type}`} className="text text_type_main-medium mb-6">
                  {tab.name}
                </h2>
                <div className={styles.ingredients}>
                  {tab.items.map((item) => (
                    <div
                      key={item._id}
                      className={styles.ingredient}
                      onClick={() => setSelectedIngredient(item)}
                      role="button"
                    >
                      {renderCounter(getIngredientCount(item._id))}
                      <img
                        src={item.image}
                        alt={`${item.name} - изображение ингредиента`}
                        className={`${styles.image} mb-1`}
                      />
                      <Price className="mb-1" cost={item.price} />
                      <div className="text text_type_main-default">{item.name}</div>
                    </div>
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
          onClose={() => setSelectedIngredient(null)}
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
