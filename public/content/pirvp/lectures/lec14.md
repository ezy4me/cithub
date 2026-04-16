# Лекция №14. Работа с API в React: fetch, axios и useEffect

## 1. Введение в работу с API

> **Работа с API в React** — процесс получения, обработки и отображения внешних данных через HTTP-запросы к серверу или сторонним сервисам.

**Ключевые понятия:**  
- **REST API** — стандарт для передачи данных через HTTP-запросы (`GET`, `POST`, `PUT`, `DELETE`).  
- **JSON** — формат данных, легко преобразуемый в объекты JavaScript.  
- **Асинхронные запросы** — позволяют загружать данные без блокировки интерфейса.

**Пример сценария:**  
Чтобы отобразить список пользователей:  
1. Отправить запрос к API.  
2. Преобразовать ответ в JavaScript-объекты.  
3. Сохранить данные в состоянии компонента и вывести в JSX.

> **Важно:** Управлять состояниями `loading` (загрузка) и `error` (ошибка), чтобы интерфейс оставался информативным.

---

### 1.1. fetch: базовые запросы и обработка ответов

> **`fetch`** — встроенный в браузер API для выполнения HTTP-запросов; возвращает Promise.

**Пример базового запроса:**
```javascript
// Получаем данные о пользователях
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));
```

**Пояснения:**  
- `fetch(url)` — отправляет GET-запрос.  
- `response.json()` — преобразует тело ответа в JavaScript-объект.  
- `.catch()` — обрабатывает ошибки сети или сервера.

**Асинхронная запись через `async/await`:**
```javascript
async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

getUsers();
```

**Особенности:**  
- По умолчанию — GET-запрос. Для других методов нужно указывать `method` и `body`.  
- Данные можно сразу сохранять в `state` компонента для отображения.

---

### 1.2. axios: удобная альтернатива fetch

> **`axios`** — популярная библиотека для HTTP-запросов; упрощает работу с JSON и обработку ошибок.

**Установка:**  
```bash
npm install axios
```

**Пример GET-запроса:**
```javascript
import axios from 'axios';

async function getUsers() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log(response.data); // данные в response.data
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

getUsers();
```

**Пример POST-запроса:**
```javascript
axios.post('https://jsonplaceholder.typicode.com/users', {
  name: 'Алексей',
  email: 'alex@example.com'
})
.then(response => console.log(response.data))
.catch(error => console.error('Ошибка:', error));
```

**Особенности axios:**  
- Ответ всегда содержит `data`, `status`, `headers`.  
- Поддержка интерсепторов, заголовков, токенов авторизации.  
- Более наглядная обработка ошибок по сравнению с `fetch`.

---

### 1.3. useEffect: загрузка данных при рендере компонента

> **`useEffect`** — хук React для выполнения побочных эффектов, таких как загрузка данных, после рендера.

**Пример с `fetch`:**
```jsx
import { useState, useEffect } from 'react';

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []); // пустой массив — эффект выполняется один раз

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Пример с `axios`:**
```jsx
useEffect(() => {
  axios.get('https://jsonplaceholder.typicode.com/users')
    .then(response => setUsers(response.data))
    .catch(error => console.error(error));
}, []);
```

> **Пояснение:** Пустой массив зависимостей означает, что эффект сработает только при монтировании компонента.

---

### 1.4. Состояния загрузки и ошибок (loading, error)

Для улучшения UX важно показывать индикатор загрузки и сообщения об ошибках.

**Пример:**
```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

> **Пояснение:**  
> - `loading` — показывает, что данные ещё не получены.  
> - `error` — хранит текст ошибки.  
> - Оба состояния обновляются после завершения запроса.

---

### 1.5. Организация client-side API слоя (api.js)

В крупных приложениях логику запросов выносят в отдельный модуль.

**Пример `api.js`:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
```

> **Преимущества:**  
> - Централизованная логика запросов.  
> - Легко добавлять новые эндпоинты.  
> - Компоненты остаются чистыми и сфокусированными на UI.

---

### 1.6. Отображение данных из API в компонентах

После получения данных их отображают через JSX и `map`.

**Пример:**
```jsx
import { useState, useEffect } from 'react';
import { fetchUsers } from './api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}

export default UserList;
```

> **Пояснение:**  
> - Каждый элемент списка должен иметь уникальный `key`.  
> - Состояния `loading` и `error` делают интерфейс предсказуемым и дружелюбным.

