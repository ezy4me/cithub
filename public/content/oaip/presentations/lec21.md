## Лекция №21

### XML и JSON: структурированные данные и сериализация

Курс: Алгоритмизация и программирование (.NET)

---

## Оглавление

1. Понятие структурированных данных и сериализации
2. Архитектура и особенности XML
3. Схемы и валидация XML (XSD)
4. Работа с XML в .NET (C#)
5. Концепция и синтаксис JSON
6. Работа с JSON в .NET (System.Text.Json)
7. Сравнение XML и JSON
8. Рекомендации по выбору формата

---

## Что такое сериализация?

* **Сериализация** – преобразование объекта в поток байтов или текст
* **Десериализация** – восстановление объекта из представления

Обеспечивает:

* Сохраняемость состояния
* Межплатформенную совместимость
* Передачу данных по сети

---

## Что такое сериализация?

![Cхема процесса сериализации объекта](https://cithub.ru/api/files/oaip_lec_21_1_1.png)

---

## Что такое сериализация?

```csharp
public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public double Score { get; set; }
}

// Отображение в JSON формате
{
    "Id": 101,
    "Name": "Анна",
    "IsActive": true,
    "Score": 4.75
}
```

---

## Что такое сериализация?

```bash
// Гипотетический пример бинарного представления объекта
2 4E 61 6D 65 22 3A 22 D0 90 D0 BD D0 BD D0 B0 22 2C ...
```

---

## Форматы структурированных данных

* **XML (eXtensible Markup Language)**
* **JSON (JavaScript Object Notation)**

**Требования к форматам:**

* ✓ Читаемость человеком
* ✓ Переносимость (платформо-независимость)
* ✓ Масштабируемость
* ✓ Поддержка типизации и валидации

---

## Где применяется сериализация?

* Веб-сервисы и API (REST, SOAP)
* Конфигурационные файлы (`appsettings.json`, `web.config`)
* Сохранение состояния приложений (кэши, логи)
* Межпроцессное и межсервисное взаимодействие
* Микросервисные архитектуры

---

## Архитектура XML

* Иерархичность (древовидная структура)
* Самодокументируемость (смысловые имена тегов)
* Расширяемость (пользовательские теги)
* Строгий синтаксис (закрывающие теги, кавычки)

---

## Пример XML: студент

```xml
<Student Id='101'>
  <FirstName>Мария</FirstName>
  <LastName>Сидорова</LastName>
  <Group>ИВТ-202</Group>
  <Grades>
    <Subject name='Алгоритмика'>5</Subject>
    <Subject name='Базы Данных'>4</Subject>
  </Grades>
</Student>
```

---

## Пример XML: проблема коллизий

```xml
<root xmlns:cfg="http://example.com/config">
  <cfg:setting name="timeout" value="30" />
</root>
```

Для избежания коллизий имён в сложных системах используется механизм пространств имён (namespaces).

Пространство имён задаётся с помощью атрибута xmlns и позволяет группировать элементы в логические домены, что особенно важно при интеграции данных из различных источников. 

---

## Корректность XML

**Well-formed (правильно построенный):**

* Соблюдение синтаксиса XML
* Один корневой элемент
* Закрытые теги, кавычки у атрибутов

**Valid (валидный):**

* Соответствие XSD-схеме
* Строгая типизация и контроль структуры

Несоблюдение требований well-formed приводит к невозможности обработки документа парсером, что делает корректное построение XML критически важным этапом при работе с этим форматом.


---

## LINQ to XML (C#)

```csharp
using System;
using System.Xml.Linq;

var student = new XElement("Student", new XAttribute("Id", 101),
    new XElement("FirstName", "Мария"),
    new XElement("LastName", "Сидорова"),
    new XElement("Group", "ИВТ-202"),
    new XElement("Grades",
        new XElement("Subject",
            new XAttribute("name", "Алгоритмика"), "5"),
        new XElement("Subject",
            new XAttribute("name", "Базы Данных"), "4"))
);

Console.WriteLine(student.ToString());
```

Для создания XML структуры в .NET используется современный подход LINQ to XML. Он находится в пространстве имен System.XML.Linq.

---

## LINQ to XML (C#)

```xml
<Student Id="101">
  <FirstName>Мария</FirstName>
  <LastName>Сидорова</LastName>
  <Group>ИВТ-202</Group>
  <Grades>
    <Subject name="Алгоритмика">5</Subject>
    <Subject name="Базы Данных">4</Subject>
  </Grades>
</Student>
```

Результат является well-formed XML, пригодным для сохранения в файл, передачи по сети или дальнейшей обработки.

---

## Применение XML в Microsoft

* Конфигурационные файлы (для настроек приложения)
* SOAP-веб-сервисы
* RSS-ленты
* Документация кода

---

## Применение XML в Microsoft

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <connectionStrings>
    <add name="DefaultConnection"
         connectionString="Host=host;Database=db;Username=name;Password=pass"
         providerName="Npgsql" />
  </connectionStrings>
</configuration>
```

---

## Применение XML в Microsoft

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Новости программирования</title>
    <link>https://example.com/</link>
    <description>Последние новости из мира IT и программирования</description>
    <language>ru</language>
    <pubDate>Tue, 15 Apr 2025 10:00:00 +0300</pubDate>

    <item>
      <title>JSON против XML: что выбрать в 2025?</title>
      <link>https://example.com/articles/json-vs-xml/</link>
      <description>Сравнительный анализ двух форматов сериализации...</description>
      <pubDate>Sun, 13 Apr 2025 09:15:00 +0300</pubDate>
      <author>anna@example.com (Анна Сидорова)</author>
      <category>Статьи</category>
    </item>
  </channel>
</rss>

Почему для RSS-лент применяется XML, а не JSON?

* Специфика RSS требует HTML-разметки, а не просто данных (HTML в JSON читать не удобно).
* Валидация и расширяемость (XML позволяет строго проверять структуру через XSD).
* Пространства имён (расширяемость) (RSS можно расширять без конфликтов).
* Обратная совместимость (Миллионы RSS-ридеров (Feedly, Inoreader, старые браузеры, почтовые клиенты) ожидают именно XML. Переход на JSON сломал бы всю экосистему).

```

---

## XML Schema (XSD)

> XML Schema Definition (XSD) — язык, разработанный консорциумом W3C для описания структуры и типов XML-документов. XSD выступает в роли контракта, которому обязан соответствовать XML-документ, что обеспечивает предсказуемость и надёжность при обмене данными между системами.


XSD позволяет определить:

* Набор разрешённых элементов
* Типы данных (int, string, decimal...)
* Обязательность полей
* Ограничения на значения
* Пространства имён

---

## Пример XSD-схемы

```xml
<!-- student.xsd -->
<?xml version="1.0" encoding="utf-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:element name="Student">
    <xs:complexType>
      <xs:sequence>

        <xs:element name="Id" type="xs:int" />
        <xs:element name="FirstName" type="xs:string" />
        <xs:element name="LastName" type="xs:string" />
        <xs:element name="Group" type="xs:string" />
        <xs:element name="AverageGrade" type="xs:decimal" />

      </xs:sequence>
    </xs:complexType>
  </xs:element>

</xs:schema>
```

---

## Валидация XML в .NET

```csharp
using System.Xml;
using System.Xml.Schema;
using System.IO;
// Загружаем схему
var settings = new XmlReaderSettings();
settings.Schemas.Add("", "student.xsd");
settings.ValidationType = ValidationType.Schema;
settings.ValidationEventHandler += (sender, e) =>
{
    Console.WriteLine($"[ОШИБКА ВАЛИДАЦИИ] {e.Message}");
};

try
{
    using var reader = XmlReader.Create("student.xml", settings);
    while (reader.Read()) { } // Чтение запускает валидацию
    Console.WriteLine("Документ валиден.");
}
catch (XmlSchemaValidationException ex)
{
    Console.WriteLine("Ошибка схемной валидации:" + $"{ex.Message}");
}
```

При работе с XML – документами экосистему .NET не интересует, валиден ли документ или нет, команда на 17 строчке будет выполнена в любом случае, потому что ошибки собираются через обработчик. 
Чтобы прервать выполнение при первой ошибке, можно выбросить исключение в ValidationEventHandler (заменить 10 строчку на throw new XmlSchemaValidationException(….)).


---

## XmlReader – потоковое чтение

* Forward-only, read-only
* Не загружает весь документ в память
* Идеален для больших файлов

**Методы:**

* `Read()`
* `MoveToContent()`
* `GetAttribute()`
* `ReadElementContentAsString()`

---

## Пример XmlReader

```csharp
string xml = @"
<Student Id='101'>
  <FirstName>Елена</FirstName>
  <LastName>Кузнецова</LastName>
  <Group>ПО-203</Group>
</Student>";

using var reader = XmlReader.Create(new StringReader(xml));

while (reader.Read())
{
    if (reader.IsStartElement("Student"))
    {
        string id = reader.GetAttribute("Id");
        Console.WriteLine($"Студент (ID: {id}):");
    }
    else if (reader.IsStartElement())
    {
        reader.Read(); // Переход к содержимому
        Console.WriteLine($"{reader.NodeType}:{reader.Value}");
    }
}
```

---

## Пример XmlReader

```xml
Студент (ID: 101):
Text: Елена
Text: Кузнецова
Text: ПО-203
```

---

## XmlWriter – создание XML

Он обеспечивает контролируемое формирование корректного well-formed XML.

**Ключевые методы:**

* `WriteStartDocument()`
* `WriteStartElement(name)`
* `WriteAttributeString(name, value)`
* `WriteElementString(name, value)`
* `WriteEndElement()`
* `WriteEndDocument()`

---

## XmlWriter – создание XML

```csharp
var settings = new XmlWriterSettings {
    Indent = true,
    Encoding = System.Text.Encoding.UTF8
};

using var writer = XmlWriter.Create(Console.Out, settings);

writer.WriteStartDocument();
writer.WriteStartElement("Students");

writer.WriteStartElement("Student");
writer.WriteAttributeString("Id", "102");
writer.WriteElementString("Name", "Саша Дюмин");
writer.WriteElementString("Course", "3");
writer.WriteEndElement(); // Student

writer.WriteEndElement(); // Students
writer.WriteEndDocument();
```

**Indent** — это настройка, которая добавляет **пробелы и переносы строк** в XML, чтобы сделать его **читаемым для человека**.


---

## XmlWriter – создание XML

```xml
<?xml version="1.0" encoding="utf-8"?>
<Students>
  <Student Id="102">
    <Name>Саша Дюмин</Name>
    <Course>3</Course>
  </Student>
</Students>
```

---

## XmlDocument – модификация XML

> LINQ to XML — это способ работы с XML как с коллекциями. Он использует классы XDocument, XElement, XAttribute и интегрируется с LINQ, что позволяет применять запросы к XML-данным.


**Ключевые методы:**

* `XDocument.Load()` / `Parse()`
* `XElement.Element(name)`, `Elements()`
* `XElement.Attribute(name)`, `Attributes()`
* `XElement.Descendants(name)`

---

## XmlDocument – модификация XML

```csharp
var xml = @"
<Students>
  <Student Id='1' Grade='4.5'>Анна</Student>
  <Student Id='2' Grade='3.8'>Борис</Student>
  <Student Id='3' Grade='4.9'>Светлана</Student>
</Students>";

var doc = XDocument.Parse(xml);
var honors = doc.Root.Elements("Student")
    .Where(s => (double)s.Attribute("Grade") > 4.0)
    .Select(s => new {
        Id = (int)s.Attribute("Id"),
        Name = s.Value,
        Grade = (double)s.Attribute("Grade")
    });

foreach (var s in honors)
{
    Console.WriteLine($"Отличник:{s.Name} (ID: {s.Id}, средний балл {s.Grade})");
}
```

---

## XmlDocument – модификация XML

```csharp
Отличник: Анна (ID: 1, средний балл: 4.5)
Отличник: Светлана (ID: 3, средний балл: 4.9)
```

---

## XmlSerializer (атрибуты)

Для управления форматом сериализации применяются специальные атрибуты, такие как:

* `[XmlElement("Name")]`
* `[XmlAttribute("Name")]`
* `[XmlIgnore]`
* `[XmlRoot("Student")]`

---

## XmlSerializer (атрибуты)

```csharp
[XmlRoot("Student")]
public class Student 
{
    [XmlAttribute("Id")] 
    public int Id { get; set; }

    [XmlElement("FullName")] 
    public string Name { get; set; }

    [XmlIgnore] 
    public bool IsActive => Id > 0;
}
```

---

## XmlSerializer (процесс сериализации и дeсериализации)
```csharp
var student = new Student
{
    Id = 101,
    Name = "Алексей Николаев",
    Group = "ИВТ-204"
};

// Сериализация
var serializer = new XmlSerializer(typeof(Student));
using (var writer = new StringWriter())
{
    serializer.Serialize(writer, student);
    Console.WriteLine("Результат сериализации:");
    Console.WriteLine(writer.ToString());
}

// Десериализация
using (var red = new StringReader(writer.ToString()))
{
    var r = (Student)serializer.Deserialize(reader);
    Console.WriteLine($"\nВосстановленный объект:" +
                      $"Id={r.Id} Name={r.Name} Group={r.Group}");
}
```

---

## XmlSerializer (процесс сериализации и дeсериализации)
```xml
<?xml version="1.0" encoding="utf-16"?>
<Student xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema"
         Id="101">
  <FullName>Алексей Николаев</FullName>
  <Group>ИВТ-204</Group>
</Student>
```

---

## Концепция JSON

* **JavaScript Object Notation**
* Текстовый формат обмена данными

Основан на двух структурах:

* Объект `{}` – коллекция ключ-значение
* Массив `[]` – упорядоченная последовательность

**Типы данных:**

* строки
* числа
* boolean
* null
* объекты
* массивы

---

## Применение JSON

* **RESTful API** — основной формат обмена данными между клиентом и сервером.
* **Асинхронные веб-запросы (AJAX)** — передача данных между браузером и сервером без перезагрузки страницы.
* **Микросервисные архитектуры** — обмен сообщениями между независимыми сервисами.

---

## Преимущества JSON

* **Простота синтаксиса** — легко читается человеком и эффективно обрабатывается машиной.
* **Низкая избыточность** — отсутствие закрывающих тегов снижает размер данных.
* **Широкая поддержка** — встроенная поддержка в JavaScript, интеграция с большинством языков и платформ.
* **Гибкость** — поддержка динамических структур и вложенных объектов.

---

## Правила синтаксиса JSON

1. Ключи всегда в двойных кавычках
2. Строки – только в двойных кавычках
3. Числа не начинаются с нуля
4. Нет запятой после последнего элемента
5. Нет комментариев
6. Даты – как строки ISO 8601

---

## Пример JSON

```json
{
  "id": 205,
  "firstName": "Артемий",
  "lastName": "Лебедев",
  "isActive": true,
  "email": "artemiy.lebedev@university.edu",
  "enrollmentDate": "2023-09-01",
  "skills": ["C#", "SQL", "Git"],
  "address": {
    "city": "Москва",
    "street": "Ленинский проспект",
    "building": 25
  }
}
```

---

## System.Text.Json – сериализация

```csharp
public class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Group { get; set; }
    public double AverageGrade { get; set; }
}

var student = new Student
{
    Id = 101,
    FirstName = "Ольга",
    LastName = "Петрова",
    Group = "ИВТ-204",
    AverageGrade = 4.6
};

string json = JsonSerializer.Serialize(student,
    new JsonSerializerOptions { WriteIndented = true });
Console.WriteLine("Результат сериализации:");
Console.WriteLine(json);
```

---

## Результат сериализации JSON

```json
{
  "Id": 101,
  "FirstName": "Ольга",
  "LastName": "Петрова",
  "Group": "ИВТ-204",
  "AverageGrade": 4.6
}
```

С параметром `WriteIndented = true` – форматированный вывод

---

## Десериализация JSON

```csharp
string inputJson = @"{
  ""Id"": 102,
  ""FirstName"": ""Дмитрий"",
  ""LastName"": ""Сидоров"",
  ""Group"": ""ПО-203"",
  ""AverageGrade"": 4.2
}";

Student restored = JsonSerializer.Deserialize<Student>(inputJson);
Console.WriteLine($"\nВосстановленный объект:");
Console.WriteLine($"Студент: {restored.FirstName}" +
                  $"{restored.LastName}," +
                  $"группа {restored.Group}," +
                  $"средний балл: {restored.AverageGrade}");
```

---

## Результат десериализации JSON

```csharp
Восстановленный объект:
Студент: Дмитрий Сидоров, группа ПО-203, средний балл: 4.9
```

---

## Настройка именования

```csharp
var options = new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

string json = JsonSerializer.Serialize(student, options);
```

Процесс десериализации требует, чтобы имена полей в JSON соответствовали свойствам класса (с учётом регистра по умолчанию) и чтобы типы данных были совместимы.

Для настройки поведения сериализатора используется класс `JsonSerializerOptions`. Наиболее частые параметры:

* `PropertyNamingPolicy = JsonNamingPolicy.CamelCase` — преобразует PascalCase в camelCase (например, `FirstName` → `firstName`).
* `IgnoreNullValues = true` — исключает поля со значением `null`.
* `PropertyNameCaseInsensitive = true` — делает сопоставление имён регистронезависимым при десериализации.

---

## Настройка именования

```json
{
  "id": 101,
  "firstName": "Ольга",
  "lastName": "Петрова",
  "group": "ИВТ-204",
  "averageGrade": 4.6
}
```

---

## Атрибуты JSON в .NET

* `[JsonPropertyName("student_id")]` – задать имя поля
* `[JsonIgnore]` – исключить свойство
* `[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]`

---

## Пример: атрибуты JSON

```csharp
public class Student
{
    [JsonPropertyName("student_id")]
    public int Id { get; set; }

    [JsonPropertyName("full_name")]
    public string FirstName { get; set; }

    public string LastName { get; set; }
    public string Group { get; set; }
    public double AverageGrade { get; set; }

    [JsonIgnore]
    public bool IsBlocked { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TemporaryNote { get; set; }
}
```

---

## Пример: атрибуты JSON

```csharp
var student = new Student
{
    Id = 101,
    FirstName = "Анна",
    LastName = "Фролова",
    Group = "ИВТ-204",
    AverageGrade = 4.8,
    IsBlocked = true,
    TemporaryNote = null
};

string json = JsonSerializer.Serialize(student,
    new JsonSerializerOptions { WriteIndented = true });
Console.WriteLine(json);
```

---

## Пример: атрибуты JSON

```json
{
  "student_id": 101,
  "full_name ": "Анна",
  "LastName": "Фролова",
  "Group": "ИВТ-204",
  "AverageGrade": 4.8
}
```

---

## Когда выбирать JSON?

* RESTful API
* Веб-приложения (JavaScript/TypeScript)
* Микросервисы
* Мобильные приложения
* Конфигурации (.NET Core / 5+)
* Когда важна высокая производительность

---

## Когда выбирать XML?

* SOAP-сервисы
* Строгая валидация через XSD
* Документоцентричные системы
* Legacy-системы (.NET Framework)
* Конфигурации `web.config` / `app.config`
* Государственные и корпоративные стандарты

---

## Заключение

* JSON – основной выбор для современных веб-приложений
* XML – остаётся в enterprise и legacy
* Оба формата поддерживаются в .NET
* Выбор зависит от требований к валидации, производительности и совместимости

---

## Спасибо за внимание!

Вопросы?
