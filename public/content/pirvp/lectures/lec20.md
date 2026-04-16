# Лекция №20. Архитектура проекта и организация кода

## 1. Почему важна архитектура?

Архитекту aura проекта — это способ организации кода, который определяет, как разные части приложения взаимодействуют друг с другом.  
Хорошо продуманная архитектура облегчает развитие проекта, делает код понятным и удобным для поддержки, особенно в команде.  
Если архитектура игнорируется, проект быстро превращается в «ком» из несвязанных кусков кода, где любое изменение может «сломать» всё приложение.

### 1.1. Проблемы плохо организованного кода

Основные трудности, которые возникают:  

- **Дублирование кода (отсутствие DRY):**  
  Программисты копируют одни и те же функции или логику в разных местах. Изменения приходится вносить во многих файлах одновременно.  
- **Сложность поддержки:**  
  Через несколько месяцев даже автору сложно понять, как работает код. Исправление багов занимает много времени.  
- **Плохая масштабируемость:**  
  Когда бизнес растёт, код не «растёт» вместе с ним. Добавление новых функций замедляется.  
- **Трудности в командной работе:**  
  Разработчики мешают друг другу, меняя одни и те же файлы. Возникают конфликты и ошибки.

**Пример из практики:**  
Маленький интернет-магазин начинался как проект в один файл `app.js`. Со временем добавились регистрация, корзина, личный кабинет. В итоге файл разросся до 3000 строк, где перемешаны маршруты, бизнес-логика и работа с базой данных. Изменить одну функцию стало практически невозможно без риска поломать всё остальное.

### 1.2. Что такое «хорошая» архитектура

Хорошая архитектура — это не «модная схема», а набор принципов и правил, которые делают проект понятным, предсказуемым и расширяемым.

**Её основные характеристики:**  
- **Читаемость:**  
  Код должен быть легко понятен даже новому разработчику. Это достигается за счёт чётких имён функций, классов и модулей, а также логичной структуры проекта.  
- **Модульность:**  
  Система разделяется на независимые части (модули, слои, компоненты). Благодаря этому изменения в одном месте минимально влияют на остальной код.  
- **Масштабируемость:**  
  Архитектура должна позволять расширять проект без необходимости его переписывать. Добавление новых функций не должно ломать существующие.  
- **Тестируемость:**  
  Логика приложения должна быть выделена в отдельные модули, которые легко покрывать модульными тестами.  
- **Поддерживаемость:**  
  Исправление ошибок и развитие проекта должны выполняться без чрезмерных затрат времени и ресурсов.

**Пример:**  
- **Плохая архитектура** — когда весь проект реализован в одном файле `server.js`.  
- **Хорошая архитектура** — когда код разделён на модули:  
  - `routes/` — маршруты API,  
  - `controllers/` — обработка запросов,  
  - `services/` — бизнес-логика,  
  - `models/` — работа с базой данных.  

Такая структура облегчает навигацию по коду и ускоряет работу команды.

**Пример проекта «в один файл»:**  
```javascript
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(express.json());

// Подключение к базе
const sequelize = new Sequelize("postgres://user:pass@localhost:5432/mydb");

// Определение модели
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false }
});

// Маршруты
app.post("/users", async (req, res) => {
  try {
    const user = await User.create({ name: req.body.name });
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.listen(3000, async () => {
  await sequelize.sync();
  console.log("Server started");
});
```
Весь код в одном файле: подключение базы, описание модели, маршруты и логика обработки.

**Пример модульной структуры проекта:**

1. **`models/user.js`**
```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false }
});

module.exports = User;
```

2. **`db.js`**
```javascript
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres://user:pass@localhost:5432/mydb");

module.exports = sequelize;
```

3. **`services/userService.js`**
```javascript
const User = require("../models/user");

exports.createUser = async (data) => {
  if (!data.name) throw new Error("Name required");
  return await User.create({ name: data.name });
};

exports.getAllUsers = async () => {
  return await User.findAll();
};
```

4. **`controllers/userController.js`**
```javascript
const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};
```

5. **`routes/users.js`**
```javascript
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/", userController.getUsers);

module.exports = router;
```

6. **`app.js`**
```javascript
const express = require("express");
const sequelize = require("./db");
const userRoutes = require("./routes/users");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

app.listen(3000, async () => {
  await sequelize.sync();
  console.log("Server started on http://localhost:3000");
});
```

---

## 2. Структура backend-проекта

Backend — это серверная часть приложения, которая отвечает за обработку запросов, работу с базой данных и бизнес-логику. Правильная организация backend-проекта позволяет:  
- Упрощать поддержку и масштабирование.  
- Легко находить и менять нужные участки кода.  
- Работать в команде без конфликтов и путаницы.

### 2.1. Основные слои и папки backend-проекта

Структура проекта обычно разделяется на следующие слои:  
1. **`routes`** — определяет маршруты (эндпоинты) и связывает URL с контроллерами.  
2. **`controllers`** — принимает входящие HTTP-запросы, вызывает сервисы, формирует ответ.  
3. **`services`** — содержит бизнес-логику, например обработку данных перед сохранением в БД.  
4. **`models`** — описывает структуру таблиц базы данных (для Sequelize это модели).  
5. **`middleware`** — промежуточные функции, которые обрабатывают запрос перед контроллером (валидация, авторизация, логирование).  
6. **`config`** — конфигурационные файлы (подключение к БД, переменные окружения).  
7. **`utils`** — вспомогательные функции, которые используются в нескольких частях приложения.

**Пример структуры проекта:**
```
project/
├─ routes/
│  └─ users.js
├─ controllers/
│  └─ userController.js
├─ services/
│  └─ userService.js
├─ models/
│  └─ user.js
├─ middleware/
│  └─ validateUser.js
├─ config/
│  └─ database.js
├─ utils/
│  └─ logger.js
```

### 2.2. Пример обработки запроса POST /users

Рассмотрим полный цикл обработки запроса на создание нового пользователя:

1. **Route (маршрут):** принимает запрос и передаёт его контроллеру.  
2. **Middleware (опционально):** проверяет корректность данных.  
3. **Controller:** получает запрос, вызывает сервис для обработки данных, возвращает результат клиенту.  
4. **Service:** выполняет бизнес-логику, например, хеширование пароля или проверку уникальности email.  
5. **Model:** взаимодействует с базой данных через ORM (Sequelize).

**Пример `routes/users.js`:**
```javascript
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validateUser = require("../middleware/validateUser");

router.post("/", validateUser, userController.createUser);

module.exports = router;
```

**Пример `controllers/userController.js`:**
```javascript
const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Пример `services/userService.js`:**
```javascript
const { User } = require("../models");

exports.createUser = async (data) => {
  // Здесь можно добавить бизнес-логику: хеширование пароля, проверку уникальности email
  return await User.create(data);
};
```

**Пример `models/user.js` (Sequelize + PostgreSQL):**
```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = User;
```

**Пример `middleware/validateUser.js`:**
```javascript
module.exports = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  next();
};
```

### 2.3. Антипаттерны backend-разработки

Антипаттерны — типичные ошибки в коде, которые усложняют поддержку и масштабирование.

**Основные антипаттерны:**  
1. **Логика в маршрутах**  
   - Прямое выполнение бизнес-логики в файлах маршрутов.  
   - Лучше: вынести логику в контроллеры и сервисы.  
2. **Прямые запросы к базе в контроллерах**  
   - Контроллер работает напрямую с ORM или БД.  
   - Лучше: использовать сервисный слой.  
3. **Дублирование кода**  
   - Одинаковые куски повторяются в разных местах.  
   - Лучше: вынести повторяющееся в утилиты или сервисы.  
4. **Смешение слоёв**  
   - Routes, Controllers, Services, Models смешаны.  
   - Лучше: строгое разделение слоёв.  
5. **Отсутствие валидации и обработки ошибок**  
   - Некорректные данные и ошибки не проверяются.  
   - Лучше: middleware для валидации и централизованная обработка ошибок.

---

## 3. Структура frontend-проекта

### 3.1. Базовые папки: components, pages, hooks, api, utils, assets

При организации frontend-проекта на React важно заранее продумать структуру папок. Это упрощает работу над проектом, делает код более читаемым и снижает вероятность ошибок при масштабировании.

**Основные папки обычно включают:**  
- **`components`** — здесь размещаются переиспользуемые элементы интерфейса: кнопки, формы, карточки и прочие визуальные блоки. Правильная организация компонентов помогает не дублировать код и ускоряет разработку новых страниц.  
- **`pages`** — отдельные страницы приложения, каждая из которых обычно соответствует маршруту (route) в приложении. Например, `HomePage`, `ProfilePage`, `CartPage`. Структурирование страниц помогает быстро ориентироваться в проекте.  
- **`hooks`** — папка для кастомных хуков, которые инкапсулируют повторяющуюся логику: работу с формами, авторизацией, запросами к серверу. Примеры: `useAuth`, `useApi`.  
- **`api`** — слой для всех взаимодействий с сервером. Централизованный API упрощает поддержку и делает код компонентов чистым, так как запросы и обработка ошибок вынесены из компонентов.  
- **`utils`** — вспомогательные функции, например форматирование дат, конвертация валют, валидация данных. Использование одной папки для утилит предотвращает хаос и дублирование.  
- **`assets`** — статические файлы: изображения, шрифты, иконки, стили. Все визуальные ресурсы проекта находятся в одном месте, что облегчает их обновление и использование.

Эта базовая структура помогает разработчикам быстро ориентироваться в проекте, упрощает масштабирование и делает работу команды более предсказуемой.

### 3.2. Презентационные и контейнерные компоненты

В React компоненты делят на два типа: презентационные (Presentational) и контейнерные (Container). Это разделение помогает поддерживать чистоту кода и упрощает масштабирование проекта.

- **Презентационные компоненты** отвечают исключительно за отображение данных. Они получают все данные через пропсы и не знают, откуда эти данные приходят. Такие компоненты легко переиспользовать, тестировать и изменять внешний вид, не затрагивая бизнес-логику.

**Пример презентационного компонента:**
```jsx
function UserCard({ name, email }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}
```

- **Контейнерные компоненты** управляют логикой и состоянием приложения. Они делают запросы к API, обрабатывают данные и передают их презентационным компонентам через пропсы.

**Пример контейнерного компонента:**
```jsx
import { useState, useEffect } from "react";
import UserCard from "./UserCard";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} name={user.name} email={user.email} />
      ))}
    </div>
  );
}
```

Такое разделение снижает связность компонентов и упрощает командную работу. Презентационные компоненты остаются простыми и переиспользуемыми, а контейнерные берут на себя управление данными и логику.

### 3.3. Кастомные хуки

В React часто требуется взаимодействие с сервером: получение данных, отправка форм, авторизация. Один из классических подходов — создавать кастомный хук, который инкапсулирует логику fetch-запросов, состояние загрузки и обработки ошибок.

**Пример кастомного хука:**
```javascript
// useApi.js
import { useState, useEffect } from 'react'

export function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}
```

**Использование кастомного хука:**
```jsx
// UserList.jsx
import { useApi } from './useApi'

function UserList() {
  const { data: users, loading, error } = useApi('/api/users')

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка загрузки</p>

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

Такой подход простой, но с ростом проекта и сложных запросов код быстро становится громоздким, а управление кешем и обновлением данных требует дополнительной логики.

Для таких случаев существуют готовые библиотеки, например **RTK Query** из Redux Toolkit. Она позволяет централизованно описывать API, управлять кешем, обновлением и состояниями загрузки без написания большого количества кастомного кода.

**Пример с RTK Query:**
```javascript
// apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => 'users' }),
  }),
})

export const { useGetUsersQuery } = api
```

**Использование с RTK Query:**
```jsx
// UserList.jsx
import { useGetUsersQuery } from './apiSlice'

function UserList() {
  const { data: users, error, isLoading } = useGetUsersQuery()

  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка загрузки данных</p>

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### 3.4. Централизованный слой API

Централизованный слой API — это единое место в проекте, где сосредоточена вся логика взаимодействия с сервером. Такой подход позволяет:  
- контролировать заголовки, авторизацию и обработку ошибок в одном месте;  
- упрощать тестирование и отладку;  
- избегать дублирования кода и разбросанных запросов по проекту;  
- облегчать замену сервера или библиотек для работы с HTTP.

**Пример простого модуля API:**
```javascript
// api.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

// Получение списка пользователей
export const fetchUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data
}

// Создание нового пользователя
export const addUser = async (userData) => {
  const response = await apiClient.post('/users', userData)
  return response.data
}

// Обновление данных пользователя
export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData)
  return response.data
}

// Удаление пользователя
export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`)
  return response.data
}
```

Централизованный слой API структурирует все сетевые операции и делает их повторно используемыми.

---

## 4. Инструменты для поддержки архитектуры

Поддержка архитектуры проекта требует не только правильной структуры папок и слоев, но и постоянного контроля качества кода, соблюдения стандартов и оптимизации процессов команды. Различные инструменты помогают автоматизировать эти задачи, сделать код более предсказуемым и снизить риск ошибок.

### 4.1. ESLint

ESLint — это инструмент статического анализа кода, который проверяет соответствие кода определённым правилам. Он позволяет:  
- Находить ошибки синтаксиса и потенциальные баги ещё до запуска кода.  
- Запретить использование небезопасных или устаревших практик (например, `var` вместо `let`/`const`).  
- Поддерживать единый стиль кода в команде (например, отступы, кавычки, пробелы).

**Пример:** ESLint может сообщить, что переменная объявлена, но не используется, или что функция слишком сложная и её стоит разбить на части.

### 4.2. Prettier

Prettier — это инструмент для автоматического форматирования кода. Его главная задача — убрать разногласия по стилю и сделать код одинаково читаемым для всех участников команды.  
- Применяется к различным языкам: JavaScript, TypeScript, CSS, JSON.  
- Интегрируется с редакторами кода и системами сборки, так что форматирование выполняется автоматически при сохранении файла.  
- Упрощает код-ревью, так как проверка стиля становится автоматической.

**Пример:** Prettier может автоматически переносить длинные строки, выравнивать отступы и исправлять кавычки, чтобы весь проект выглядел единообразно.

### 4.3. Стандарты именования

Единая система именования повышает читаемость и облегчает навигацию по проекту. Она особенно важна для крупных команд и долгоживущих продуктов.  
- Компоненты React обычно используют **PascalCase** (`UserCard`, `LoginForm`).  
- Функции и переменные — **camelCase** (`fetchData`, `userList`).  
- Папки и файлы должны иметь логичные и понятные имена (`components/Header`, `pages/ProfilePage`).

Такая система позволяет сразу понимать назначение файла или переменной и снижает риск конфликтов имен.

---