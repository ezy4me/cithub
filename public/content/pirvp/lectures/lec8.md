# Лекция №8. Формы и клиентская валидация

---

## 1. Основы HTML-форм

### 1.1. Парный тег `<form>`

HTML-форма — это область на странице, где пользователь может ввести данные: текст, выбрать опции, поставить галочки и т.д. Эти данные можно отправить на сервер или обработать с помощью JavaScript.

> **HTML-форма** — это элемент веб-страницы, предназначенный для сбора и отправки пользовательских данных.

Форма начинается с тега `<form>` и заканчивается `</form>`:

```html
<form action="/submit" method="POST">
  <!-- Элементы формы -->
</form>
```

- **`action`** — адрес, куда отправляются данные формы
- **`method`** — HTTP-метод отправки:
  - `GET` — данные передаются в URL (например, при поиске)
  - `POST` — данные передаются «внутри» запроса (без отображения в URL)

---

### 1.2. Кнопки отправки и сброса

**`<button type="submit">`**

Кнопка отправки формы. При нажатии:
- Происходит проверка на корректность (`required`, `pattern` и др.)
- Если всё в порядке, данные отправляются на `action`
- Если используется JS — можно перехватить отправку и обработать данные самостоятельно

```html
<form>
  <input type="text" required>
  <button type="submit">Отправить</button>
</form>
```

**`<button type="reset">`**

Кнопка сброса — очищает все поля формы до их значений по умолчанию.

```html
<form>
  <input type="text" value="Текст">
  <button type="reset">Сбросить</button>
</form>
```

`reset` сбрасывает значения, даже если они были изменены вручную пользователем.

---

### 1.3. Элементы управления формами

**`<input>` — универсальный элемент**

Тип определяется атрибутом `type`:
- `text`, `email`, `password`, `number`
- `checkbox`, `radio`, `file`
- `hidden`, `range`, `date` и др.

```html
<input type="email" name="userEmail" placeholder="Email" required>
```

**`<textarea>` — многострочный ввод**

```html
<textarea name="comment" placeholder="Введите текст"></textarea>
```

**`<select>` — выпадающий список**

```html
<select name="gender">
  <option value="male">Мужской</option>
  <option value="female">Женский</option>
</select>
```

**`<button>` — кнопка**

```html
<button type="submit">Отправить</button>
<button type="reset">Очистить</button>
<button type="button" onclick="alert('Нажали!')">Обычная</button>
```

- `type="submit"` — отправляет форму
- `type="reset"` — сбрасывает значения
- `type="button"` — просто кнопка для действий через JS

---

### 1.4. Часто используемые атрибуты

| Атрибут | Назначение |
|---------|------------|
| `name` | Имя поля — используется при отправке формы |
| `required` | Обязательное для заполнения |
| `placeholder` | Подсказка внутри поля |
| `value` | Значение по умолчанию |
| `readonly` | Только для чтения, нельзя изменить |
| `disabled` | Поле неактивно (серое) |
| `pattern` | Регулярное выражение для проверки значения |
| `maxlength` | Максимальная длина ввода |

![Пример формы](https://cithub.ru/api/files/lec_1_22_1.png)

---

## 2. Работа с формами на JavaScript

### 2.1. Основные события форм

Основные события форм: `submit`, `input`, `change`, `focus`, `blur`

- **`submit`** — происходит при отправке формы (например, при нажатии кнопки `type="submit"`)
- **`input`** — срабатывает при каждом изменении значения в полях ввода (`input`, `textarea`)
- **`change`** — происходит, когда поле теряет фокус и значение изменилось (чаще для `select`, `checkbox`, `radio`)
- **`focus`** — когда элемент получает фокус
- **`blur`** — когда элемент теряет фокус

> **События форм** — это действия, которые происходят при взаимодействии пользователя с элементами формы.

---

### 2.2. Получение и обработка значений

Значения из полей формы можно получить через свойство `.value` у элементов `input`, `textarea` и `select`.

**Пример:**

```javascript
const nameInput = document.getElementById('name');
console.log(nameInput.value);
```

---

### 2.3. Предотвращение стандартной отправки

Чтобы форма не перезагружала страницу при отправке, используется метод `event.preventDefault()` внутри обработчика события `submit`.

**Пример: отправка формы с JS-обработкой**

```html
<form id="myForm">
  <input type="text" id="username" name="username" placeholder="Введите имя" required />
  <button type="submit">Отправить</button>
</form>

<script>
  const form = document.getElementById('myForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Остановить стандартную отправку формы
    const username = form.username.value;
    alert('Имя пользователя: ' + username);
  });
</script>
```

![Уведомление](https://cithub.ru/api/files/lec_1_22_1.png)


**Пример: валидация при потере фокуса**

```html
<label for="inputEmail">Ваш email:</label>
<input type="email" id="inputEmail" placeholder="..." />
<div id="error"></div>
```

```javascript
const input = document.getElementById('inputEmail');
const error = document.getElementById('error');

input.addEventListener('blur', () => {
  if (!input.value.includes('@')) {
    input.classList.add('invalid');
    error.textContent = 'Пожалуйста, введите правильный email.';
  }
});

input.addEventListener('focus', () => {
  if (input.classList.contains('invalid')) {
    input.classList.remove('invalid');
    error.textContent = '';
  }
});
```

![Отображение ошибки](https://cithub.ru/api/files/lec_1_22_1.png)

---

## 3. Валидация данных

Валидация данных — это проверка корректности введённой информации перед отправкой формы. Существует два основных подхода:

- **HTML5-валидация** — встроенная в браузер (простая и быстрая)
- **JavaScript-валидация** — даёт гибкость и контроль (рекомендуется для более сложных случаев)

> **Валидация** — это процесс проверки данных на соответствие определённым правилам и требованиям.

---

### 3.1. HTML5-валидация

HTML предоставляет набор атрибутов валидации, которые позволяют проверять данные без JavaScript.

| Атрибут | Описание |
|---------|----------|
| `required` | Обязательное поле |
| `type` | Тип ввода (`email`, `number`, `password` и др.) |
| `min`, `max` | Минимум/максимум для чисел или даты |
| `minlength`, `maxlength` | Ограничения по длине строки |
| `pattern` | Проверка по регулярному выражению |
| `step` | Шаг числового значения |
| `placeholder` | Подсказка внутри поля |

**Пример:**

```html
<input type="email" required placeholder="..." />
<input type="password" required minlength="6" />
<input type="number" min="18" max="100" />
<input type="tel" pattern="^\+7\d{10}$" placeholder="+71234567890" />
```

Браузер сам покажет ошибку при попытке отправки с неверными данными.

---

### 3.2. JavaScript-валидация

Помимо встроенной HTML5-валидации, можно выполнять проверку вручную с помощью JavaScript.

| Метод | Описание |
|-------|----------|
| `element.value` | Получение значения из поля формы |
| `element.setCustomValidity(message)` | Установка собственного текста ошибки (если message пустой, ошибка сбрасывается) |
| `form.checkValidity()` | Возвращает `true`, если все поля валидны, иначе `false` (не показывает ошибок пользователю) |
| `form.reportValidity()` | Проверяет и отображает ошибки пользователю |

> **Важно:** Метод `setCustomValidity()` сам по себе не показывает сообщение. Оно будет отображено только при отправке формы или при вызове:
> - `form.reportValidity()` — запускает проверку и показывает ошибку
> - `form.checkValidity()` — просто проверяет (возвращает `true`/`false`), не показывает

**Пример комплексной валидации:**

```html
<form id="myForm">
  <label>Email:
    <input type="email" id="email" required />
  </label> 
  
  <label>Пароль:
    <input type="password" id="password" required />
  </label>
  
  <button type="submit">Отправить</button>
</form>

<script>
  const form = document.getElementById('myForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Очистим предыдущие ошибки
    email.setCustomValidity('');
    password.setCustomValidity('');

    // Простейшая проверка email на наличие @
    if (!email.value.includes('@')) {
      email.setCustomValidity('Введите корректный email');
    }

    // Пароль должен быть не короче 6 символов
    if (password.value.length < 6) {
      password.setCustomValidity('Пароль короткий');
    }

    // Показываем ошибки или продолжаем отправку
    if (form.checkValidity()) {
      alert('Форма успешно отправлена!');
      // form.submit(); // Можно вручную отправить, если нужно
    } else {
      form.reportValidity(); // Покажет ошибки
    }
  });
</script>
```

---

### 3.3. Регулярные выражения

Регулярные выражения (RegExp) — мощный инструмент проверки текстовых шаблонов, особенно для JS-валидации.

> **Регулярные выражения** — это шаблоны для поиска и проверки текста по определённым правилам.

Метод `.test()` применяется к регулярному выражению (RegExp) и проверяет, соответствует ли строка заданному шаблону. Возвращает `true`, если строка соответствует, и `false` — если нет.

**Основные символы регулярных выражений:**

| Шаблон | Значение |
|--------|----------|
| `^` | Начало строки |
| `$` | Конец строки |
| `\d` | Цифра (0–9) |
| `\D` | Любой нецифровой символ |
| `\w` | Символ слова (буква, цифра, «_») `[a-zA-Z0-9_]` |
| `\W` | Всё, что не входит в `\w` |
| `\s` | Пробельный символ (пробел, табуляция, перенос) |
| `\S` | Всё, что не является пробельным символом |
| `[a-z]` | Буква от a до z |
| `{n,m}` | Повторение от n до m раз |
| `{n}` | Ровно n раз |
| `{n,}` | n и более раз |
| `*` | 0 и более раз |
| `+` | Один или более |
| `?` | Ноль или один |

**Пример проверки телефона:**

```javascript
const phone = '+71234567890';
const pattern = /^\+7\d{10}$/;
console.log(pattern.test(phone)); // true
```

**Пример проверки email:**

```javascript
const email = "user@example.com";
const emailRegex = /^[\w.-]+@[a-z]+\.[a-z]{2,}$/i;
console.log(emailRegex.test(email)); // true
```

**Пояснение:**
- `^` — начало строки
- `[\w.-]+` — буквы, цифры, подчёркивания, точки, дефисы (логин)
- `@` — символ собаки
- `[a-z]+` — домен
- `\.` — точка перед доменной зоной
- `[a-z]{2,}` — минимум две буквы (например, "com", "ru")
- `i` — флаг "без учёта регистра"

**Пример проверки пароля:**

```javascript
const password = "qwerty12";
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
console.log(passwordRegex.test(password)); // true
```

**Пояснение:**
- `(?=.*[a-zA-Z])` — хотя бы одна буква 
- `(?=.*\d)` — хотя бы одна цифра
- `[a-zA-Z\d]{8,}` — только буквы и цифры, минимум 8 символов