import { useCallback, useEffect, useState } from 'react';

import styles from './home.module.css';

const Home = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [newRecipe, setNewRecipe] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/recipes')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      });
  }, []);

  const createRecipe = useCallback(() => {
    fetch(`/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'New Recipe',
        category: 'Dessert',
        owner: 'John Doe',
        area: 'USA',
        instructions: 'Mix ingredients and bake.',
        description: 'A delicious dessert recipe.',
        thumb: 'https://example.com/image.jpg',
        time: '30 minutes',
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setNewRecipe(data);
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      });
  }, []);

  return (
    <div>
      <h1>Welcome to Foodies</h1>
      <p>Your delicious journey to culinary experiences begins here</p>

      <section>
        <h2>Recipes</h2>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.title}</h2>
              <p>Category: {recipe.category}</p>
              <p>Owner: {recipe.owner}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Ready to Start Your Food Journey?</h2>
        <button onClick={createRecipe}>Create new recipe</button>
        {newRecipe && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles['success-message']}>
              Recipe created successfully!
            </div>
            <code>{JSON.stringify(newRecipe, null, 2)}</code>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
