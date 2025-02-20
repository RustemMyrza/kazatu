import React, { useState, useEffect } from 'react';

const RedirectMessage = ({ onRedirect }) => {
  const [count, setCount] = useState(3); // Начальное значение счетчика

  useEffect(() => {
    if (count === 0) {
      // Когда счетчик достигает 0, вызываем переданную функцию
      onRedirect();
      return;
    }

    // Уменьшаем счетчик каждую секунду
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, [count, onRedirect]);

  return (
    <div>
      <h4>Мы перенаправляем вас на другого оператора</h4>
      <p>Осталось: {count} секунд</p>
    </div>
  );
};


export default RedirectMessage;