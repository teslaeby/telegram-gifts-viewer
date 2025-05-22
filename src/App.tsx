import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface Gift {
  id: number;
  name: string;
  stars: number;
  image: string;
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
    // Инициализация Telegram WebApp
    const initTelegramApp = async () => {
      try {
        // Получаем данные пользователя
        const user = WebApp.initDataUnsafe.user;
        if (user) {
          setUserData({
            id: user.id,
            username: user.username || '',
            first_name: user.first_name,
            last_name: user.last_name
          });
        }

        // Здесь будет реальный запрос к API Telegram для получения подарков
        // Для MVP используем моковые данные
        const mockGifts: Gift[] = [
          {
            id: 1,
            name: "Birthday Gift",
            stars: 100,
            image: "🎁"
          },
          {
            id: 2,
            name: "Special Gift",
            stars: 200,
            image: "🎀"
          }
        ];
        
        setGifts(mockGifts);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize app');
        setLoading(false);
      }
    };

    initTelegramApp();
  }, []);

  if (loading) {
    return <div className="loading">Loading gifts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      {userData && (
        <div className="user-info">
          <h2>Welcome, {userData.first_name}!</h2>
          {userData.username && <p>@{userData.username}</p>}
        </div>
      )}
      <h1>My Telegram Gifts</h1>
      <div className="gifts-grid">
        {gifts.map((gift) => (
          <div key={gift.id} className="gift-card">
            <div className="gift-image">{gift.image}</div>
            <div className="gift-name">{gift.name}</div>
            <div className="gift-stars">⭐ {gift.stars}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 