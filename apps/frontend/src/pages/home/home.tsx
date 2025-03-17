import { useCallback, useState } from 'react';

import styles from './home.module.css';

const Home = () => {
  const [succeeded, setSucceeded] = useState(false);

  const makeOrder = useCallback(() => {
    fetch(`/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'John Doe' }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        console.log(data);
        setSucceeded(true);
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
        <h2>Ready to Start Your Food Journey?</h2>
        <button onClick={makeOrder}>Order Now</button>
        {succeeded && (
          <div className={styles['success-message']}>
            Order placed successfully!
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
