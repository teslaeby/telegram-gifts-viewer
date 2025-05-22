import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface Gift {
  count: number;
  name: string;
  price_ton: string;
}

interface UserData {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
}

function App() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const initTelegramApp = async () => {
      try {
        const user = WebApp.initDataUnsafe.user;
        if (user) {
          setUserData({
            id: user.id,
            username: user.username || '',
            first_name: user.first_name,
            last_name: user.last_name
          });

          // Запрашиваем реальные подарки с backend
          const resp = await fetch(`http://127.0.0.1:8004/gifts?username=${user.username}`);
          const data = await resp.json();
          if (data.gifts) {
            setGifts(data.gifts);
          } else {
            setError('Не удалось получить подарки');
          }
        } else {
          setError('Не удалось получить данные пользователя');
        }
      } catch (err) {
        setError('Ошибка загрузки подарков');
      } finally {
        setLoading(false);
      }
    };
    initTelegramApp();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка подарков...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      {userData && (
        <div className="user-info">
          <h2>Добро пожаловать, {userData.first_name}!</h2>
          {userData.username && <p>@{userData.username}</p>}
        </div>
      )}
      <h1>Мои Telegram подарки</h1>
      {gifts.length === 0 ? (
        <div className="error">Подарков не найдено</div>
      ) : (
        <div className="gifts-grid">
          {gifts.map((gift, idx) => (
            <div key={idx} className="gift-card">
              <div className="gift-name">{gift.name}</div>
              <div className="gift-stars">Цена: <b>{gift.price_ton}</b> TON</div>
              <div className="gift-count">Количество: {gift.count}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App; 