import { useEffect, useState } from 'react';

export function App() {
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    fetch('/api')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        );
      });
  }, []);

  return (
    <>
      <div>APP CONTENT</div>
      {succeeded && <div>SUCCEEDED TO CALL API</div>}
    </>
  );
}

export default App;
