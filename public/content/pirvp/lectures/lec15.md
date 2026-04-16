# Лекция №15. Формы и маршрутизация в React

## 1. Введение в формы в React

> **Формы в React** — основной способ взаимодействия пользователя с приложением; позволяют вводить данные, которые обрабатываются, отправляются на сервер или изменяют внутреннее состояние.

В отличие от обычного HTML, React использует **контролируемые компоненты**, где значение поля формы управляется состоянием (`state`), а не DOM напрямую.

### 1.1. Контролируемые и неконтролируемые компоненты

> **Контролируемый компонент** — элемент формы, значение которого управляется через состояние React (`useState`).

**Пример:**
```jsx
import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Имя: ${name}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Имя:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
}
```

**Особенности:**  
- `value={name}` — React полностью контролирует значение.  
- `onChange={handleChange}` — обновляет состояние при вводе.  
- `handleSubmit` — предотвращает перезагрузку страницы.

> **Неконтролируемый компонент** — элемент формы, хранящий значение в DOM; React получает его через `ref`.

**Пример:**
```jsx
import { useRef } from "react";

function NameFormUncontrolled() {
  const nameRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Имя: ${nameRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Имя:
        <input type="text" ref={nameRef} />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
}
```

**Особенности:**  
- Значение хранится в DOM, а не в состоянии.  
- Используется `ref` для получения значения при отправке.

---

### 1.2. Управление состоянием формы

Контролируемые компоненты — стандартный подход в React. Все поля формы связаны с состоянием, что упрощает валидацию и управление.

**Пример формы с несколькими полями:**
```jsx
import { useState } from "react";

function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Данные формы:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Имя:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
}
```

**Преимущества:**  
1. Все данные формы находятся в `state`.  
2. Легко добавлять валидацию.  
3. Возможность динамически управлять интерфейсом (например, блокировать кнопку).

**Пример простой валидации:**
```jsx
const handleSubmit = (event) => {
  event.preventDefault();
  if (!formData.email.includes("@")) {
    alert("Введите корректный email");
    return;
  }
  console.log("Данные формы корректны:", formData);
};
```

---

### 1.3. Отправка данных на сервер

Формы часто используются для отправки данных на сервер через HTTP-методы: `POST` (создание), `PUT` (обновление), `DELETE` (удаление).

**Пример с `fetch` (POST):**
```jsx
const handleSubmit = async (event) => {
  event.preventDefault();
  
  try {
    const response = await fetch("https://example.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при отправке данных");
    }

    const result = await response.json();
    console.log("Пользователь создан:", result);
  } catch (error) {
    console.error(error.message);
  }
};
```

**Пример с `axios`:**
```jsx
import axios from "axios";

const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post("https://example.com/api/users", formData);
    console.log("Пользователь создан:", response.data);
  } catch (error) {
    console.error(error.message);
  }
};
```

> **Преимущество `axios`:** автоматический парсинг JSON и более краткий синтаксис.

---

## 2. Маршрутизация в React

> **Маршрутизация** — механизм создания многостраничных приложений без перезагрузки страницы; реализуется с помощью библиотеки `react-router-dom`.

### 2.1. Настройка маршрутов

**Установка:**  
```bash
npm install react-router-dom
```

**Пример базовой настройки:**
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

> **Пояснение:**  
> - `<BrowserRouter>` — управляет историей навигации.  
> - `<Routes>` — контейнер для маршрутов.  
> - `<Route path="..." element={...} />` — связывает путь с компонентом.

---

### 2.2. Ссылки и навигация

Для перехода между страницами используется компонент `<Link>` вместо `<a>`.

**Пример:**
```jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/about">О нас</Link>
    </nav>
  );
}
```

> **Особенности:**  
> - `<Link>` не перезагружает страницу.  
> - Можно использовать `<NavLink>` для стилизации активной ссылки.

---

### 2.3. Параметры маршрутов

Для динамических страниц (например, профиль пользователя) используются параметры.

**Пример:**
```jsx
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  return <h1>Профиль пользователя {id}</h1>;
}
```

**Маршрут:**  
```jsx
<Route path="/user/:id" element={<UserProfile />} />
```

> **Пояснение:**  
> - `:id` — динамический сегмент URL.  
> - `useParams()` возвращает объект с параметрами.

---

### 2.4. Обработка ошибок маршрутизации

Для отображения страницы «404» используется маршрут с маской `*`.

**Пример:**
```jsx
<Route path="*" element={<NotFound />} />
```

> **Особенности:**  
> - `*` ловит все неопределённые пути.  
> - Полезен для редиректа или показа ошибки.

---

### 2.5. Программная навигация

Для перехода по событию (например, после отправки формы) используется хук `useNavigate`.

**Пример:**
```jsx
import { useNavigate } from "react-router-dom";

function SubmitForm() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/success"); // переход на страницу успеха
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Отправить</button>
    </form>
  );
}
```

> **Особенности:**  
> - `navigate("/путь")` — прямой переход.  
> - `navigate(-1)` — возврат назад (как кнопка браузера).

---

### 2.6. Защищённые маршруты

Для ограничения доступа к страницам (например, только для авторизованных):

**Пример компонента:**
```jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

**Использование:**
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute user={currentUser}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

> **Особенности:**  
> - `replace` предотвращает возврат на защищённую страницу через «назад».  
> - Можно комбинировать с проверкой токена или роли.

---

### 2.7. Lazy loading маршрутов

Для ускорения загрузки приложения компоненты можно загружать по требованию.

**Пример:**
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

> **Пояснение:**  
> - `lazy(() => import(...))` — загрузка компонента при необходимости.  
> - `<Suspense fallback={...}>` — показывает индикатор загрузки.  
> - Рекомендуется для больших страниц; маленькие можно импортировать напрямую.

