# Лекция №12. Введение в серверную разработку: Node.js, Express.js и ORM

## Что такое Node.js

> **Node.js** — серверная среда выполнения JavaScript, позволяющая запускать JS вне браузера.

**Особенности:**  
- Событийно-ориентированная архитектура  
- Неблокирующий I/O  
- Единый язык на клиенте и сервере

---

## Применение Node.js

- Разработка REST API  
- Real-time приложения (чаты, игры)  
- Работа с БД и файловой системой  
- Автоматизация задач и скрипты

---

## Основные команды Node.js

```bash
node -v
npm -v
node app.js
npm init -y
npm install <package>
npm uninstall <package>
```

---

## Express.js: настройка и маршруты

> **Express.js** — минималистичный фреймворк для Node.js, упрощающий создание веб-приложений и API.

**Преимущества:**  
- Простая настройка  
- Поддержка маршрутов и middleware  
- Легкая интеграция с БД

---

## Создание базового приложения Express

```bash
npm install express
```

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Запуск: `node app.js` → `http://localhost:3000`

---

## Определение маршрутов

> **Маршрут** — правило обработки HTTP-запроса по пути.

Формат: `app.METHOD(PATH, HANDLER)`

**Примеры:**
```javascript
app.get('/users/:id', (req, res) => {
    res.send(`User: ${req.params.id}`);
});

app.get('/search', (req, res) => {
    res.send(`Term: ${req.query.term}`);
});
```

---

## Middleware

> **Middleware** — функция, выполняемая до передачи управления обработчику маршрута.

Используется для:  
- Логирования  
- Парсинга тела запроса  
- Авторизации  

**Глобальный middleware:**
```javascript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

> Обязательно вызывать `next()`.

---

## MVC и контроллеры

> **MVC** — архитектурный шаблон: Model–View–Controller.

В REST API:  
**Клиент → Route → Controller → Model → Database**

**Преимущества:**  
- Чёткое разделение ответственности  
- Упрощённое тестирование  
- Чистая структура кода

![](https://cithub.ru/api/files/pirvp_lec_12_24_1.png)

---

## Подключение к базам данных через ORM

> **ORM** — инструмент для работы с БД через объекты, без прямых SQL-запросов.

**Популярные ORM в Node.js:**  
- **Sequelize** — для SQL (PostgreSQL, MySQL)  
- **Mongoose** — для NoSQL (MongoDB)

---

## Подключение к PostgreSQL через Sequelize

```bash
npm install sequelize pg pg-hstore
```

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydb', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433
});

sequelize.authenticate()
    .then(() => console.log('Подключено'))
    .catch(err => console.error('Ошибка:', err));
```

---

## Основные операции с ORM (CRUD)

**Создание:**
```javascript
const user = await User.create({ name: 'Alice', email: 'a@mail.com' });
```

**Чтение:**
```javascript
const users = await User.findAll();
const user = await User.findOne({ where: { id: 1 } });
```

**Обновление:**
```javascript
await User.update({ name: 'Bob' }, { where: { id: 1 } });
```

**Удаление:**
```javascript
await User.destroy({ where: { id: 1 } });
```

---

## Практическое применение

> **`npm init -y`** — быстрая инициализация проекта с `package.json`.

![](https://cithub.ru/api/files/pirvp_lec_12_4_1.png)

---

## Установка зависимостей

```bash
npm install express sequelize pg pg-hstore
npm install -D nodemon
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_2.png)  
![](https://cithub.ru/api/files/pirvp_lec_12_4_3.png)

---

## Архитектура проекта (MVC)

- **`controllers/`** — бизнес-логика  
- **`middleware/`** — промежуточные обработчики  
- **`models/`** — модели и подключение к БД  
- **`routes/`** — определение эндпоинтов  
- **`app.js`** — главный файл сервера

![](https://cithub.ru/api/files/pirvp_lec_12_4_4.png)

---

## Файл `db.js` — подключение к БД

```javascript
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mydb', 'postgres', 'admin', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres'
});
module.exports = sequelize;
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_6.png)

---

## Файл `user.js` — модель пользователя

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = User;
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_7.png)

---

## Файл `app.js` — настройка сервера

```javascript
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./models/db');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Server started'));
});
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_8.png)

---

## Файл `userController.js` — CRUD-операции

```javascript
const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};

exports.createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
};
// ... остальные методы
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_9.png)

---

## Файл `userRoutes.js` — маршруты

```javascript
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.get('/', ctrl.getAllUsers);
router.post('/', ctrl.createUser);
router.get('/:id', ctrl.getUserById);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

module.exports = router;
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_10.png)

---

## Middleware валидации

```javascript
function validateUser(req, res, next) {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({ error: 'name и email обязательны' });
    }
    next();
}
```

![](https://cithub.ru/api/files/pirvp_lec_12_4_11.png)

---

## Тестирование API

- Запуск: `nodemon app.js`  
- GET `/users` → список пользователей  
- POST `/users` → создание  
- GET `/users/1` → получение по ID  
- PUT `/users/1` → обновление  
- DELETE `/users/1` → удаление

![](https://cithub.ru/api/files/pirvp_lec_12_4_12.png)  
![](https://cithub.ru/api/files/pirvp_lec_12_4_13.png)  
![](https://cithub.ru/api/files/pirvp_lec_12_4_14.png)  
![](https://cithub.ru/api/files/pirvp_lec_12_4_15.png)  
![](https://cithub.ru/api/files/pirvp_lec_12_4_16.png)  
![](https://cithub.ru/api/files/pirvp_lec_12_4_17.png)

