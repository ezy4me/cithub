# Лекция №16. Аутентификация и авторизация: JWT, cookies

## 1. Введение в аутентификацию и авторизацию

Аутентификация и авторизация — два ключевых механизма безопасности. Они идут рядом, но решают разные задачи.  
- Аутентификация (Authentication) — проверка личности пользователя.  
- Авторизация (Authorization) — проверка прав доступа.

**Аналогия:**  
- Вы показываете паспорт → аутентификация.  
- Охранник проверяет, можно ли вам войти в кабинет директора → авторизация.

### 1.1. Чем отличается аутентификация от авторизации?

Аутентификация – процесс проверки, действительно ли пользователь тот, за кого себя выдаёт.

**Примеры:**  
- Логин + пароль.  
- Вход через Google или GitHub.  
- Отпечаток пальца, Face ID.

**Ключевой момент:**  
Пароли не хранятся в базе в открытом виде, они должны быть захэшированы (например, через bcrypt).

**Простой пример аутентификации (Express.js):**
```javascript
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const users = [
  { id: 1, email: "user@mail.com", password: await bcrypt.hash("123456", 10), role: "user" }
];

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: "Неверный email" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Неверный пароль" });

  const token = jwt.sign({ id: user.id, role: user.role }, "SECRET", { expiresIn: "1h" });
  res.json({ token });
});

app.listen(3000, () => console.log("Server running"));
```

Авторизация – процесс проверки прав доступа к ресурсам после успешной аутентификации.

**Примеры:**  
- Пользователь может редактировать только свой профиль.  
- Администратор имеет доступ к панели управления.

**Ключевой момент:**  
- Если пользователь не аутентифицирован → ошибка 401 Unauthorized.  
- Если аутентифицирован, но прав недостаточно → ошибка 403 Forbidden.

**Простой пример авторизации (Express.js):**
```javascript
function checkAdmin(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет токена" });

  try {
    const payload = jwt.verify(token, "SECRET");
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }
    next();
  } catch {
    res.status(401).json({ message: "Неверный токен" });
  }
}

app.get("/admin", checkAdmin, (req, res) => {
  res.send("Добро пожаловать, админ!");
});
```

**Проверка аутентификации и авторизации (React):**
```jsx
import { useState } from "react";

export default function App() {
  const [token, setToken] = useState(null);

  async function login() {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@mail.com", password: "123456" })
    });
    const data = await res.json();
    setToken(data.token);
  }

  return (
    <div>
      {!token ? (
        <button onClick={login}>Войти</button>
      ) : (
        <h1>Вы вошли в систему</h1>
      )}
    </div>
  );
}
```

### 1.2. Stateless vs Stateful-подход (сессии vs токены)

**Stateful (сессии):**  
- Сервер хранит состояние пользователя (сессию) в памяти или базе.  
- Клиенту выдаётся cookie с session ID.  
- Сервер по этому ID находит данные о пользователе.

**Плюсы:** просто реализовать.  
**Минусы:** плохо масштабируется (нужно хранить сессии на всех серверах).

**Пример (Express + cookie-сессии):**
```javascript
import session from "express-session";

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

app.post("/login", (req, res) => {
  req.session.user = { id: 1, role: "user" };
  res.send("Сессия создана");
});
```

**Stateless (JWT-токены):**  
- Сервер не хранит состояние.  
- Все данные (ID, роль и т. д.) зашифрованы в токене.  
- Клиент хранит токен (в cookie или localStorage) и отправляет его при каждом запросе.

**Плюсы:** легко масштабировать (сервер ничего не хранит).  
**Минусы:** нужно внимательно думать о безопасности хранения токенов.

**Пример (Express + JWT):**
```javascript
import jwt from "jsonwebtoken";

app.post("/login", (req, res) => {
  const token = jwt.sign({ id: 1, role: "user" }, "SECRET", { expiresIn: "1h" });
  res.json({ token });
});
```

**Сравнение**  
- Сессии (stateful) → сервер «помнит» пользователя.  
- JWT (stateless) → сервер «забывает», а проверяет подпись токена.

На практике в React+Express проектах обычно используют JWT (stateless).

---

## 2. Работа с JWT

JWT (JSON Web Token) — это компактный токен для передачи информации между клиентом и сервером. Он основан на цифровой подписи, поэтому сервер может доверять данным внутри токена.

### 2.1. Что такое JWT? Структура

JWT состоит из трёх частей, разделённых точками:  
`header.payload.signature`

- Header – тип токена и алгоритм подписи (HS256, RS256).  
- Payload – данные (например, userId, role).  
- Signature – подпись, гарантирующая, что токен не подделан.

**Пример расшифрованного токена:**  
Header:  
```json
{ "alg": "HS256", "typ": "JWT" }
```

Payload:  
```json
{ "id": 1, "role": "user", "exp": 1699999999 }
```

Signature:  
`hash(Header + Payload + secret)`

### 2.2. Создание и проверка токена (Express)

**Генерация токена при логине:**
```javascript
import jwt from "jsonwebtoken";

app.post("/login", (req, res) => {
  const user = { id: 1, role: "user" };
  const token = jwt.sign(user, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token });
});
```

**Проверка токена (middleware):**
```javascript
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    req.user = jwt.verify(token, "SECRET_KEY");
    next();
  } catch {
    res.status(403).json({ error: "Неверный токен" });
  }
}
```

### 2.3. Где и какие данные хранить в JWT?

JWT не должен содержать чувствительные данные. Всё, что находится в payload, можно легко расшифровать (это просто Base64). Поэтому хранить там пароли или конфиденциальные сведения опасно.

**Рекомендуется хранить:**  
- userId — уникальный идентификатор пользователя.  
- role — роль (например: user, admin, manager).  
- exp — время жизни токена (обязательно для безопасности).  
- iat — время создания токена (опционально).

**Чего хранить нельзя:**  
- Пароли  
- Email в открытом виде (лучше использовать id)  
- Банковские данные, персональные ключи

**Пример правильного payload:**
```json
{
  "id": 42,
  "role": "admin",
  "exp": 1699999999
}
```

JWT должен быть ключом к данным, а не хранилищем самих данных.  
При запросе на сервер мы используем id из токена, а затем подгружаем детали пользователя из базы данных.

```javascript
// Пример: защищенный маршрут
app.get("/profile", auth, (req, res) => {
  // userId берём из токена
  const user = db.findById(req.user.id);
  res.json(user);
});
```

---

## 3. Способы хранения токенов

После того как токен был выдан пользователю, возникает ключевой вопрос: где его хранить?  
От этого напрямую зависит безопасность приложения.

Есть два основных варианта:  
1. Cookies — сервер сам отправляет токен, и браузер автоматически прикрепляет его к запросам.  
2. localStorage / sessionStorage — фронтенд вручную сохраняет токен и добавляет его в заголовки запросов.

Каждый метод имеет свои сильные и слабые стороны. Рассмотрим подробнее.

### 3.1. Cookies

Куки — это традиционный способ хранения информации в браузере.  
Для JWT важно правильно настроить cookie-параметры:  
- HttpOnly — токен недоступен из JavaScript, защищает от XSS.  
- Secure — куки отправляются только по HTTPS.  
- SameSite — ограничивает отправку куки с внешних сайтов (защита от CSRF):  
  - Strict — куки отправляются только при переходах с того же домена.  
  - Lax — отправляются при обычной навигации, но не при кросс-сайтовых POST-запросах.  
  - None — куки можно отправлять отовсюду, но только с Secure.

**Пример:**
```javascript
// Авторизация
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Проверка пользователя...
  const token = jwt.sign({ id: 1, role: "user" }, "secret", { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,       // только HTTPS
    sameSite: "lax",    // ограничение кросс-доменных запросов
  });

  res.json({ message: "Успешный вход" });
});
```

**Плюсы:**  
- Защита от XSS (при HttpOnly).  
- Автоматическая отправка с запросами.

**Минусы:**  
- Возможность CSRF (если не настроен SameSite).  
- Сложнее управлять токенами на клиенте.

### 3.2. localStorage / sessionStorage

Ещё один популярный способ — хранить токен прямо в браузере.  
- localStorage — сохраняет данные навсегда (даже после закрытия браузера).  
- sessionStorage — хранит только в рамках одной вкладки.

**Пример:**
```javascript
// После логина
localStorage.setItem("token", token);

// При запросах
fetch("/profile", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
```

**Плюсы:**  
- Просто использовать.  
- Полный контроль на фронтенде.

**Минусы:**  
- Уязвимо для XSS (злоумышленник может украсть токен).  
- Нужно вручную добавлять заголовки в каждый запрос.

| Метод хранения | Плюсы | Минусы |
|----------------|-------|--------|
| Cookies | Защита от XSS, автоматическая отправка | Риск CSRF, сложнее в отладке |
| localStorage | Простой доступ, легко использовать | Уязвимо для XSS |
| sessionStorage | Безопаснее localStorage (сбрасывается при закрытии вкладки) | Всё ещё уязвимо для XSS |

**Вывод:**  
- Cookies (с HttpOnly, Secure, SameSite=Lax/Strict) — рекомендуемый вариант для большинства production-проектов. Они обеспечивают защиту от XSS и автоматически отправляются браузером, что упрощает работу. Но важно не забыть про защиту от CSRF.  
- localStorage — проще в реализации и часто используется в pet-проектах или внутренних админках. Однако он уязвим для XSS, поэтому в production используется редко.  
- sessionStorage — компромиссный вариант, так как токен хранится только в рамках одной вкладки. Но угроза XSS всё равно остаётся.

**На практике:**  
- Если нужен максимальный уровень безопасности — используем куки.  
- Если нужно быстро и просто — можно хранить токен в localStorage, но только в проектах без строгих требований к безопасности.

---