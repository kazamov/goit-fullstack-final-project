import { useCallback, useState } from 'react';

export function App() {
  const [succeeded, setSucceeded] = useState(false);

  /*   useEffect(() => {
    fetch(`${serviceUrl}/api/data`)
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
          error
        );
      });
  }, []); */

  const makePost = useCallback(() => {
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
    <>
      <div>APP CONTENT</div>
      <button onClick={makePost}>Make Post</button>
      {succeeded && <div>SUCCEEDED TO CALL API</div>}
    </>
  );
}

export default App;
