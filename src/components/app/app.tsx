import {
  INGREDIENT_TYPES,
  type IngredientType,
  type TIngredient,
  type WithUniqueId,
} from '@/utils/types';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { ErrorFallback } from '@components/error/error-fallback';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [selectedIngredients, setSelectedIngredients] = useState<
    WithUniqueId<TIngredient>[]
  >([]);

  const fetchIngredients = async (): Promise<TIngredient[]> => {
    const url = new URL('ingredients', import.meta.env.VITE_API_URL).toString();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }

      const parsedResponse = (await response.json()) as { data: TIngredient[] };
      return parsedResponse.data;
    } catch (error) {
      console.error('Fetch ошибка:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadIngredients = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await fetchIngredients();
        setIngredients(data);

        // TODO: при следующей итерации убрать
        setSelectedIngredients(
          data.map((ingredient) => ({
            ...ingredient,
            uniqueId: `${ingredient._id}-${performance.now()}`,
          }))
        );
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка'));
      } finally {
        setLoading(false);
      }
    };
    void loadIngredients();
  }, []);

  const addIngredient = useCallback((ingredient: TIngredient) => {
    setSelectedIngredients((prev) => {
      let newList = [...prev];
      // тип булочки и соуса может быть один
      const singleChoiceTypes = [
        INGREDIENT_TYPES.BUN,
        INGREDIENT_TYPES.SAUCE,
      ] as IngredientType[];
      if (singleChoiceTypes.includes(ingredient.type as IngredientType)) {
        newList = newList.filter((it) => it.type != ingredient.type);
      }
      return [
        ...newList,
        { ...ingredient, uniqueId: `${ingredient._id}-${performance.now()}` },
      ];
    });
  }, []);

  const deleteIngredient = useCallback((uniqueId: string) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {loading ? (
        <Preloader />
      ) : error ? (
        <ErrorFallback error={error} resetErrorBoundary={() => setError(null)} />
      ) : (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients
              ingredients={ingredients}
              selectedIngredients={selectedIngredients}
              addIngredient={addIngredient}
            />
            <BurgerConstructor
              selectedIngredients={selectedIngredients}
              deleteIngredient={deleteIngredient}
            />
          </main>
        </>
      )}
    </div>
  );
};

export default App;
