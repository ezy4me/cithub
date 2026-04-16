# Лекция №12. Введение в серверную разработку: Node.js, Express.js и ORM

## 1. Что такое Node.js

> **Node.js** — серверная среда выполнения JavaScript, позволяющая запускать JS вне браузера; широко используется для разработки серверных приложений, API и real-time сервисов.

**Особенности Node.js:**  
- **Событийно-ориентированная архитектура** — позволяет обрабатывать множество запросов одновременно без блокировки основного потока.  
- **Неблокирующий I/O** — операции ввода-вывода (чтение/запись файлов, запросы к базе данных и др.) выполняются асинхронно, что повышает производительность.  
- **Единый язык** — JavaScript используется как на клиенте, так и на сервере, что упрощает разработку.

### 1.1. Применение Node.js

Node.js подходит для различных сценариев:  
- Разработка REST API и веб-сервисов.  
- Создание real-time приложений (чаты, игры, стриминговые сервисы).  
- Работа с базами данных и файловой системой.  
- Автоматизация задач и написание скриптов для сборки, тестирования и развертывания проектов.

### 1.2. Основные команды Node.js

Для работы с Node.js и npm важно знать базовые команды:

- **Проверка версии Node.js**  

```bash
  node -v
```

- **Проверка версии npm** 

```bash
npm -v
```

- **Запуск JS-файла**  

```bash
node app.js
```

- **Инициализация проекта и создание package.json**  

```bash
npm init -y
```

- **Установка пакета**  

```bash
npm install <package_name>
```

- **Удаление пакета**  

```bash
npm uninstall <package_name>
```

Эти команды составляют основу для работы с проектами на Node.js и позволяют быстро запускать код, подключать библиотеки и управлять зависимостями.

---

## 2. Express.js: настройка и маршруты

> **Express.js** — минималистичный и гибкий фреймворк для Node.js, упрощающий создание веб-приложений и API; позволяет быстро настраивать сервер, обрабатывать маршруты и подключать промежуточное ПО (middleware).

**Основные преимущества Express:**  
- Простая настройка и структура проекта  
- Поддержка маршрутов и middleware  
- Легкая интеграция с базами данных и сторонними библиотеками

### 2.1. Создание базового приложения Express

**Установка Express**  

```bash
npm install express
```

**Создание файла приложения `app.js`**  

```javascript
const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

**Запуск приложения**  

```bash
node app.js
```

Сервер будет доступен по адресу `http://localhost:3000`.

**Разбор кода:**  
- `const express = require('express');` — подключение библиотеки Express через стандартный механизм импорта модулей в Node.js.  
- `const app = express();` — создание экземпляра приложения; объект `app` управляет сервером, маршрутами и middleware.  
- `const PORT = 3000;` — указание порта; рекомендуется использовать `process.env.PORT || 3000` для гибкости.  
- `app.get('/', ...)` — определение маршрута для обработки GET-запросов к корню сайта.  
  - `req` — объект запроса (содержит данные от клиента).  
  - `res` — объект ответа (используется для отправки данных клиенту).  
  - `res.send(...)` — отправка текстового ответа.  
- `app.listen(...)` — запуск сервера; колбэк выводит сообщение о готовности.

**Рекомендации:**  
- Использовать переменную порта: `const PORT = process.env.PORT || 3000`.  
- Для автоматической перезагрузки при разработке использовать `nodemon`:  
  ```bash
  npm install -g nodemon
  nodemon app.js
  ```

---

### 2.2. Определение маршрутов (routes)

> **Маршрут** — правило, определяющее, как сервер реагирует на HTTP-запрос по конкретному пути.

Формат маршрута:  

```javascript
app.METHOD(PATH, HANDLER)
```
- `METHOD` — HTTP-метод (`get`, `post`, `put`, `delete` и др.).  
- `PATH` — путь (например, `'/'`, `'/users'`).  
- `HANDLER` — функция-обработчик `(req, res) => { ... }`.

**Примеры маршрутов:**

1. **GET-запрос к корню**  

```javascript
app.get('/', (req, res) => {
    res.send('Главная страница');
});
```

2. **POST-запрос для создания ресурса**  

```javascript
app.post('/users', (req, res) => {
    res.send('Создан новый пользователь');
});
```

3. **GET с параметром маршрута**  

```javascript
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Информация о пользователе с ID: ${userId}`);
});
```

4. **Маршрут с несколькими параметрами**  

```javascript
app.get('/users/:userId/orders/:orderId', (req, res) => {
    const { userId, orderId } = req.params;
    res.send(`Пользователь ${userId}, заказ ${orderId}`);
});
```

5. **GET с query-параметрами**  

```javascript
app.get('/search', (req, res) => {
    const { term, limit } = req.query;
    res.send(`Поиск по запросу: ${term}, количество результатов: ${limit}`);
});
```
Пример запроса: `/search?term=Node.js&limit=5`.

---

### 2.3. Middleware: назначение и использование

> **Middleware** — функция, выполняемая во время обработки запроса до передачи управления конечному обработчику маршрута.

Middleware используется для:  
- Логирования  
- Парсинга тела запроса  
- Проверки авторизации  
- Обработки ошибок  

Подключается глобально через `app.use()` или локально — как аргумент маршрута.

**Глобальный middleware**  

```javascript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // обязательно вызывать!
});
```

**Middleware для конкретного маршрута**  

```javascript
function checkAuth(req, res, next) {
    const authorized = true; // упрощённая проверка
    if (authorized) {
        next();
    } else {
        res.status(401).send('Не авторизован');
    }
}

app.get('/dashboard', checkAuth, (req, res) => {
    res.send('Добро пожаловать на панель управления');
});
```

> **Важно:** Функция `next()` должна быть вызвана, иначе запрос зависнет.

---

### 2.4. MVC и контроллеры

> **MVC (Model–View–Controller)** — архитектурный шаблон, разделяющий приложение на три компонента: модель (данные), представление (вывод) и контроллер (логика обработки запросов).

В REST API на Express:  
**Клиент → Route → Controller → Model → Database**

**Преимущества MVC:**  
- Чёткое разделение ответственности  
- Упрощённое тестирование и поддержка  
- Повторное использование компонентов  
- Чистая и понятная структура кода

**Пример контроллера (`controllers/userController.js`)**  

```javascript
const { User } = require('../models/db');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

**Пример маршрута (`routes/userRoutes.js`)**  

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);

module.exports = router;
```

![](https://cithub.ru/api/files/pirvp_lec_12_24_1.png)

--- 

Вот ваш фрагмент, оформленный строго в вашем стиле — с правильной нумерацией, определениями в одну строку, списками, отступами и без излишеств:

---

## 3. Подключение к базам данных через ORM

> **ORM (Object-Relational Mapping)** — инструмент, позволяющий работать с базой данных через объекты языка программирования, не используя прямые SQL-запросы.

В Node.js популярные ORM:  
- **Sequelize** — для SQL-баз данных (например, PostgreSQL, MySQL).  
- **Mongoose** — для NoSQL-баз данных (например, MongoDB).

Использование ORM упрощает выполнение стандартных операций CRUD (создание, чтение, обновление, удаление) через понятные методы и объекты.

### 3.1. Подключение к PostgreSQL через Sequelize

**Установка Sequelize и драйвера PostgreSQL**  

```bash
npm install sequelize pg pg-hstore
```

**Простейший пример подключения (`db.js`)**  

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// Подключение к PostgreSQL
const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

// Проверка соединения
sequelize.authenticate()
    .then(() => console.log('Подключение к PostgreSQL установлено'))
    .catch(err => console.error('Ошибка подключения:', err));
```

**Создание модели User**  

```javascript
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Синхронизация модели с базой
sequelize.sync()
    .then(() => console.log('Модель User создана в базе'));
```

**Пояснения:**  
- `Sequelize` управляет соединением и генерирует SQL-запросы.  
- `define` создаёт модель, соответствующую таблице в базе.  
- `sync()` создаёт таблицу, если она ещё не существует.

---

### 3.2. Основные операции с ORM (Sequelize + PostgreSQL)

Sequelize позволяет выполнять стандартные CRUD-операции через JavaScript-методы, избегая написания «сырых» SQL-запросов.

**Создание (Create)**

Добавление новой записи в таблицу:

```javascript
const newUser = await User.create({
    name: 'Alice',
    email: 'alice@mail.com'
});
console.log(newUser.id); // ID новой записи
```

**Пояснение:**  
- `User` — модель Sequelize, соответствующая таблице `Users`.  
- Метод `create` принимает объект с данными.  
- Возвращается экземпляр модели с автоматически заполненными полями (`id`, `createdAt`, `updatedAt`).

**Чтение (Read)**

Получение данных из таблицы:

```javascript
// Все пользователи
const users = await User.findAll();
console.log(users);

// Конкретный пользователь по ID
const user = await User.findOne({ where: { id: 1 } });
console.log(user.name);
```

**Пояснение:**  
- `findAll()` возвращает массив всех записей.  
- `findOne({ where: {...} })` возвращает одну запись по условию.  
- Объект `where` преобразуется в SQL-условие `WHERE`.

**Обновление (Update)**

Изменение существующих данных:

```javascript
await User.update(
    { name: 'Bob' },          // новые значения
    { where: { id: 1 } }      // условие обновления
);
```

**Пояснение:**  
- Первый аргумент — поля для обновления.  
- Второй аргумент — условие (`where`), чтобы не затронуть все записи.  
- Метод возвращает массив с количеством обновлённых строк.

**Удаление (Delete)**

Удаление записей из таблицы:

```javascript
await User.destroy({ where: { id: 1 } });
```

**Пояснение:**  
- `destroy` удаляет записи, соответствующие условию `where`.  
- Без условия будет удалено всё содержимое таблицы — поэтому `where` обязателен в большинстве случаев.

---

## 4. Практическое применение

Рассмотрим создание простого CRUD-приложения — от инициализации проекта до тестирования маршрутов.

> **`npm init -y`** — быстрая инициализация Node.js-проекта с созданием файла `package.json` по умолчанию, без интерактивных вопросов.

- `npm init` — задаёт вопросы (имя проекта, версия, описание и т.д.).  
- `npm init -y` — создаёт `package.json` сразу со стандартными значениями (`name`: имя папки, `version`: `1.0.0` и т.д.).

![Инициализация package.json](https://cithub.ru/api/files/pirvp_lec_12_4_1.png)

Для работы с Express и PostgreSQL требуются следующие пакеты:  
- **express** — фреймворк для создания веб-приложений и API на Node.js.  
- **sequelize** — ORM для работы с реляционными базами данных.  
- **pg** — официальный драйвер для подключения к PostgreSQL в Node.js (необходим для Sequelize).  
- **pg-hstore** — утилита для корректной обработки специальных типов данных PostgreSQL внутри Sequelize.

После установки пакеты сохраняются в `node_modules` и добавляются в раздел `dependencies` файла `package.json`.

![Установка зависимостей](https://cithub.ru/api/files/pirvp_lec_12_4_2.png)

Для автоматического перезапуска сервера при разработке устанавливается `nodemon`:

> **`nodemon`** — утилита, автоматически перезапускающая Node.js-приложение при изменении файлов; удобна на этапе разработки.

- Флаг `-D` (или `--save-dev`) указывает, что пакет устанавливается только для разработки (`devDependencies`) и не будет использоваться в production.

![Установка dev зависимостей](https://cithub.ru/api/files/pirvp_lec_12_4_3.png)

Проект построен по архитектуре **MVC** с чётким разделением на слои:

1. **`controllers/`**  

Содержит бизнес-логику.  
- `userController.js` — обработчики CRUD-операций для пользователей.

2. **`middleware/`**  

Промежуточные обработчики между запросом и ответом.  
- `validateUser.js` — проверка корректности входящих данных.

3. **`models/`**  

Работа с базой данных.  
- `db.js` — конфигурация подключения к БД.  
- `user.js` — модель пользователя.

4. **`routes/`**  

Определение API-эндпоинтов.  
- `userRoutes.js` — маршруты для работы с пользователями.

5. **`node_modules/`**  

Автоматически создаваемая папка с зависимостями. Не редактируется вручную.

**Корневые файлы:**  
- `app.js` — главный файл приложения: подключает middleware, регистрирует маршруты, запускает сервер.  
- `package.json` — метаданные проекта, зависимости, скрипты.  
- `package-lock.json` — зафиксированные версии пакетов.

![Базовая архитектура сервера](https://cithub.ru/api/files/pirvp_lec_12_4_4.png)

![Настройка скриптов для запуска](https://cithub.ru/api/files/pirvp_lec_12_4_5.png)

Файл `db.js` создаёт соединение с PostgreSQL через Sequelize:  
- Пользователь: `postgres`  
- Пароль: `admin`  
- Хост: `localhost:5433`  
- База: `mydb`  

Экспортируемый объект делает подключение доступным для всего приложения.

![Подключение к БД](https://cithub.ru/api/files/pirvp_lec_12_4_6.png)

Файл `user.js` описывает модель пользователя в Sequelize:  
- `id` — автоинкрементный числовой идентификатор  
- `name` — обязательное строковое поле  
- `email` — обязательное и уникальное строковое поле  

Модель использует подключение из `db.js`.

![Создание модели User](https://cithub.ru/api/files/pirvp_lec_12_4_7.png)

Файл `app.js` — основной файл сервера:

1. **Импорт зависимостей**  

- `express`  
- маршруты из `./routes/userRoutes`  
- подключение к БД из `./models/db`

2. **Настройка сервера**  

- `const app = express()`  
- `app.use(express.json())` — парсинг JSON-тела запроса  
- `app.use('/users', userRoutes)` — подключение маршрутов

3. **Синхронизация с БД**  

- `sequelize.sync()` — создаёт таблицы по моделям

4. **Запуск сервера** 

- `app.listen(3000)`

![Настройка сервера](https://cithub.ru/api/files/pirvp_lec_12_4_8.png)

Файл `userController.js` реализует CRUD-операции:

1. **`getAllUsers`** — `User.findAll()` → список всех пользователей  
2. **`createUser`** — `User.create(req.body)` → новый пользователь (статус 201)  
3. **`getUserById`** — `User.findOne({ where: { id } })` → пользователь или 404  
4. **`updateUser`** — `User.update(...)` → обновление или 404  
5. **`deleteUser`** — `User.destroy(...)` → удаление или 404

Все методы обрабатывают ошибки и возвращают JSON.

![CRUD операции](https://cithub.ru/api/files/pirvp_lec_12_4_9.png)

Файл `userRoutes.js` определяет REST-маршруты:

- `GET /` — получить всех пользователей  
- `POST /` — создать пользователя (с валидацией)  
- `GET /:id` — получить пользователя по ID  
- `PUT /:id` — обновить пользователя (с валидацией)  
- `DELETE /:id` — удалить пользователя

![Создание маршрутов](https://cithub.ru/api/files/pirvp_lec_12_4_10.png)

Файл `validateUser.js` — middleware для валидации:

- Проверяет наличие `name` и `email` в `req.body`  
- При отсутствии — возвращает `400 Bad Request`  
- При успехе — вызывает `next()` для передачи управления контроллеру

![Создание middleware](https://cithub.ru/api/files/pirvp_lec_12_4_11.png)

![Запуск сервера](https://cithub.ru/api/files/pirvp_lec_12_4_12.png)

![Проверка GET запроса](https://cithub.ru/api/files/pirvp_lec_12_4_13.png)

![Проверка POST запроса](https://cithub.ru/api/files/pirvp_lec_12_4_14.png)

![Проверка GET запроса с параметром](https://cithub.ru/api/files/pirvp_lec_12_4_15.png)

![Проверка PUT запроса](https://cithub.ru/api/files/pirvp_lec_12_4_16.png)

![Проверка DELETE запроса](https://cithub.ru/api/files/pirvp_lec_12_4_17.png)

