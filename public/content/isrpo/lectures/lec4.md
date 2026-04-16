# Лекция №4. Программная работа с электронными документами

## 1. Библиотека Microsoft.Office.Interop

> **Microsoft.Office.Interop** — библиотека платформы .NET, предназначенная для программной работы с электронными документами Microsoft Office.

Существует два основных варианта данной библиотеки:  
- **Microsoft.Office.Interop.Excel** — для работы с документами формата `.xls` / `.xlsx`.  
- **Microsoft.Office.Interop.Word** — для работы с документами формата `.doc` / `.docx`.

---

## 2. Чтение данных из Excel в WPF-приложении

Имеется электронная таблица `ExampleBook.xlsx` со следующей структурой:  
- Столбец A — уникальный идентификатор  
- Столбец B — логин  
- Столбец C — пароль  

![Структура электронной таблицы](https://cithub.ru/api/files/isrpo_lec_4_2_1.png)

**Задача:** реализовать приложение, которое прочитает данные из таблицы и сохранит их в базе данных.

### 2.1. Подключение библиотеки

Для работы с Excel необходимо подключить COM-библиотеку:  

1. В **Обозревателе решений** → **Ссылки** → **Добавить ссылку**  
2. Перейти на вкладку **COM**  
3. Выбрать **Microsoft Excel 15.0 Object Library**  
4. Нажать **ОК**

![Менеджер ссылок](https://cithub.ru/api/files/isrpo_lec_4_21_1.png)

### 2.2. Создание пользовательского интерфейса

Добавляем кнопку импорта данных и привязываем к ней обработчик события. Также подключаем пространство имён `Microsoft.Office.Interop.Excel` в коде.

**Файл `MainWindow.xaml`:**
```xml
<Window x:Class="InteropExcelApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:InteropExcelApp"
        mc:Ignorable="d"
        Title="MainWindow" Height="450" Width="800">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="11*"/>
        </Grid.RowDefinitions>
        <Grid Grid.Row="0">
            <Button x:Name="BnImport" Click="BnImport_Click">Импорт данных</Button>
        </Grid>
    </Grid>
</Window>
```

---

### 2.3. Логика обработки (C#)

Файл `MainWindow.xaml.cs`:

```csharp
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
// Подключение пространства имен
using Excel = Microsoft.Office.Interop.Excel;

namespace InteropExcelApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void BnImport_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog()
            {
                DefaultExt = "*.xls;*.xlsx",
                Filter = "файл Excel (Spisok.xlsx)|*.xlsx",
                Title = "Выберите файл базы данных"
            };

            if (!(ofd.ShowDialog() == true))
                return;
        }
    }
}
```

**Пояснение:**  
- Экземпляр класса `OpenFileDialog` используется для создания и отображения диалогового окна, позволяющего пользователю найти и открыть файл.  
- Свойство `DefaultExt` задаёт расширение имени файла по умолчанию.  
- Свойство `Filter` определяет строку фильтра имён файлов, доступных в поле «Тип файлов» (например, `*.xlsx`).  
- Свойство `Title` задаёт заголовок диалогового окна.  
- Если файл не выбран (`ShowDialog()` возвращает `false`), метод завершается без дальнейших действий.

---

### 2.4. Чтение данных из электронной таблицы

После выбора файла необходимо реализовать чтение его содержимого. Продолжение метода `BnImport_Click`:

```csharp
string[,] list;

Excel.Application ObjWorkExcel = new Excel.Application();
Excel.Workbook ObjWorkBook = ObjWorkExcel.Workbooks.Open(ofd.FileName);
Excel.Worksheet ObjWorkSheet = (Excel.Worksheet)ObjWorkBook.Sheets[1];

var lastCell = ObjWorkSheet.Cells.SpecialCells(Excel.XlCellType.xlCellTypeLastCell);
int _columns = (int)lastCell.Column;
int _rows = (int)lastCell.Row;

list = new string[_rows, _columns];

for (int j = 0; j < _columns; j++)
    for (int i = 0; i < _rows; i++)
        list[i, j] = ObjWorkSheet.Cells[i + 1, j + 1].Text;

ObjWorkBook.Close(false, Type.Missing, Type.Missing);
ObjWorkExcel.Quit();
GC.Collect();
```

**Пояснение:**  
- **Строка 1:** Создаётся двумерный массив `list` для хранения данных из `.xlsx`-файла.  
- **Строка 2:** Создаётся экземпляр `Excel.Application` — точка входа в библиотеку Interop.  
- **Строка 3:** Метод `Open` загружает файл по пути `ofd.FileName` и возвращает объект `Workbook`.  
- **Строка 4:** Выбирается первый лист документа (`Sheets[1]`) для чтения.  
- **Строка 5:** Определяется последняя непустая ячейка с помощью `SpecialCells(xlCellTypeLastCell)`.  
- **Строки 6–7:** Из этой ячейки извлекаются номера последнего столбца (`_columns`) и строки (`_rows`).  
- **Строка 8:** Выделяется память под массив нужного размера.  
- **Строки 9–11:** Данные из ячеек копируются в массив `list` (индексация в Excel начинается с 1, поэтому `i+1`, `j+1`).  
- **Строка 12:** Книга закрывается без сохранения изменений (`false`).  
- **Строка 13:** Завершается работа приложения Excel.  
- **Строка 14:** Вызывается сборщик мусора для освобождения COM-ресурсов.

---

### 2.5. Интеграция с базой данных через Entity Framework

> **Entity Framework (EF)** — технология объектно-реляционного отображения (ORM) в .NET, позволяющая работать с базой данных через объекты C#, а не SQL-запросы.

Для сохранения данных из Excel в базу используется подход **Database First**: сначала создаётся таблица в БД, затем модель генерируется на её основе.

**Этап 1 – Создание таблицы `Users` в базе данных**

![Создание таблицы Users](https://cithub.ru/api/files/isrpo_lec_4_25_1.png)

**Этап 2 – Добавление элемента «Модель ADO.NET EDM» в проект**

![Добавление модели ADO.NET EDM](https://cithub.ru/api/files/isrpo_lec_4_25_2.png)

**Этап 3 – Выбор пункта «Конструктор EF из базы данных» (подход Database First)**

![Выбор конструктора EF из базы данных](https://cithub.ru/api/files/isrpo_lec_4_25_3.png)

**Этап 4 – Указание имени сервера и выбор базы данных**

![Указание сервера и базы данных](https://cithub.ru/api/files/isrpo_lec_4_25_4.png)

**Этап 5 – Проверка строки подключения в мастере моделей**

![Проверка строки подключения](https://cithub.ru/api/files/isrpo_lec_4_25_5.png)

**Этап 6 – Выбор таблиц для подключения к приложению**

![Выбор таблиц для импорта](https://cithub.ru/api/files/isrpo_lec_4_25_6.png)

После завершения мастера в проекте появляется:  
- файл `.edmx` — визуальная модель данных,  
- классы сущностей (например, `User`),  
- контекст базы данных (`ModelContainer`),  
- строка подключения в `App.config`.

--- 

### 2.6. Сохранение данных в базу данных

После чтения данных из Excel их необходимо сохранить в таблицу `Users`. Продолжение метода `BnImport_Click`:

```csharp
using (UsersEntities usersEntities = new UsersEntities())
{
    for (int i = 0; i < _rows; i++)
    {
        usersEntities.Users.Add(new Users()
        {
            Log = list[i, 1],
            Pass = list[i, 2]
        });
    }
    usersEntities.SaveChanges();
}
```

**Пояснение:**  
- Создаётся экземпляр контекста базы данных `UsersEntities` через `using` (гарантирует освобождение ресурсов).  
- В цикле перебираются строки массива `list`.  
- Для каждой строки создаётся новый объект `Users` с полями `Log` (столбец B → индекс 1) и `Pass` (столбец C → индекс 2).  
- Метод `SaveChanges()` фиксирует все добавленные записи в базе данных.

После выполнения операции новые записи появляются в таблице `Users`.

![Результирующая выборка в базе данных](https://cithub.ru/api/files/isrpo_lec_4_26_1.png)

--- 

Вот продолжение **Лекции №4**, оформленное **строго в вашем стиле** — с полным кодом, пояснениями, правильной структурой и заменой упоминаний рисунков на изображения по шаблону:

---

## 3. Работа с таблицами Excel в WPF (запись)

> **Цель:** реализовать экспорт данных из приложения в Excel: список студентов каждой группы сохраняется на отдельном листе, названном по номеру группы.

### 3.1. Подготовка проекта

1. Подключаем библиотеку **Microsoft Excel 15.0 Object Library** через:  

- *Обозреватель решений → Ссылки → Добавить ссылку → COM*.

2. Обновляем модель Entity Framework, добавив сущности `Students` и `Groups`.
3. Добавляем кнопку экспорта в интерфейс.

**Файл `MainWindow.xaml`:**
```xml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="*"/>
        <RowDefinition Height="11*"/>
    </Grid.RowDefinitions>
    <UniformGrid Grid.Row="0" Columns="2">
        <Button x:Name="BnExport" Click="BnExport_Click">Экспорт в Excel</Button>
        <Button x:Name="BnImport" Click="BnImport_Click">Импорт данных</Button>
    </UniformGrid>
</Grid>
```

---

### 3.2. Получение данных из базы

Метод `BnExport_Click` начинается с загрузки всех студентов и групп:

```csharp
List<Student> allStudents;
List<Group> allGroups;

using (UsersEntities usersEntities = new UsersEntities())
{
    allStudents = usersEntities.Students.ToList().OrderBy(s => s.Name).ToList();
    allGroups = usersEntities.Groups.ToList().OrderBy(g => g.NumberGroup).ToList();
}
```

> Данные сортируются для упорядоченного отображения.

---

### 3.3. Создание новой книги Excel

```csharp
var app = new Excel.Application();
app.SheetsInNewWorkbook = allGroups.Count;
Excel.Workbook workbook = app.Workbooks.Add(Type.Missing);
```

> Количество листов в новой книге устанавливается равным числу групп.

---

### 3.4. Формирование листов по группам

Полный код метода `BnExport_Click`:

```csharp
var app = new Excel.Application();
app.SheetsInNewWorkbook = allGroups.Count;
Excel.Workbook workbook = app.Workbooks.Add(Type.Missing);

// Группировка студентов по ID группы
var studentsCategories = allStudents.GroupBy(s => s.NumberGroupId).ToList();

for (int i = 0; i < allGroups.Count; i++)
{
    int startRowIndex = 1;
    Excel.Worksheet worksheet = app.Worksheets.Item[i + 1];
    worksheet.Name = allGroups[i].NumberGroup.ToString();

    // Заголовок группы
    Excel.Range headerRange = worksheet.Range[worksheet.Cells[1, 1], worksheet.Cells[2, 1]];
    headerRange.Merge();
    headerRange.Value = allGroups[i].NumberGroup;
    headerRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
    headerRange.Font.Italic = true;
    startRowIndex++;

    // Названия колонок
    worksheet.Cells[1, startRowIndex] = "Порядковый номер";
    worksheet.Cells[2, startRowIndex] = "ФИО студента";
    startRowIndex++;

    // Студенты группы
    foreach (Student student in allStudents)
    {
        if (student.NumberGroupId == allGroups[i].Id)
        {
            worksheet.Cells[1, startRowIndex] = student.Id;
            worksheet.Cells[2, startRowIndex] = student.Name;
            startRowIndex++;
        }
    }

    // Итоговое количество студентов
    worksheet.Cells[1, startRowIndex].Formula = $"=СЧЁТ(A3:A{startRowIndex - 1})";
    worksheet.Cells[1, startRowIndex].Font.Bold = true;

    // Оформление: границы и автоширина
    Excel.Range rangeBorders = worksheet.Range[worksheet.Cells[1, 1], worksheet.Cells[2, startRowIndex - 1]];
    var borders = Excel.XlBordersIndex;
    rangeBorders.Borders[borders.xlEdgeBottom].LineStyle = Excel.XlLineStyle.xlContinuous;
    rangeBorders.Borders[borders.xlEdgeLeft].LineStyle = Excel.XlLineStyle.xlContinuous;
    rangeBorders.Borders[borders.xlEdgeTop].LineStyle = Excel.XlLineStyle.xlContinuous;
    rangeBorders.Borders[borders.xlEdgeRight].LineStyle = Excel.XlLineStyle.xlContinuous;
    rangeBorders.Borders[borders.xlInsideHorizontal].LineStyle = Excel.XlLineStyle.xlContinuous;
    rangeBorders.Borders[borders.xlInsideVertical].LineStyle = Excel.XlLineStyle.xlContinuous;
    worksheet.Columns.AutoFit();
}

app.Visible = true;
```

**Важно:**  
- В Excel индексация ячеек: `Cells[столбец, строка]`.  
- Формула `=СЧЁТ(...)` позволяет автоматически обновлять количество при изменении данных.  
- `AutoFit()` подстраивает ширину столбцов под содержимое.  
- `app.Visible = true` делает Excel-книгу видимой после завершения экспорта.

---

## 4. Работа с документами Word в WPF (запись)

> **Цель:** реализовать экспорт данных из приложения в Microsoft Word: список студентов каждой группы размещается на отдельной странице в виде таблицы с заголовком и итоговой строкой.

### 4.1. Подготовка проекта

1. Подключаем библиотеку **Microsoft Word 15.0 Object Library** через:  

- *Обозреватель решений → Ссылки → Добавить ссылку → COM*.

![Подключение библиотеки Word](https://cithub.ru/api/files/isrpo_lec_4_41_1.png)

2. Обновляем интерфейс, добавляя кнопку экспорта в Word.

**Файл `MainWindow.xaml`:**
```xml
<UniformGrid Grid.Row="0" Columns="3">
    <Button x:Name="BnExport" Click="BnExport_Click">Экспорт в Excel</Button>
    <Button x:Name="BnImport" Click="BnImport_Click">Импорт данных</Button>
    <Button x:Name="BnExportWord" Click="BnExportWord_Click">Экспорт в Word</Button>
</UniformGrid>
```

3. Подключаем пространство имён в коде:

```csharp
using Word = Microsoft.Office.Interop.Word;
```

---

### 4.2. Получение и группировка данных

```csharp
List<Student> allStudents;
List<Group> allGroups;

using (UsersEntities usersEntities = new UsersEntities())
{
    allStudents = usersEntities.Students.ToList().OrderBy(s => s.Name).ToList();
    allGroups = usersEntities.Groups.ToList().OrderBy(g => g.NumberGroup).ToList();
    var studentsCategories = allStudents.GroupBy(s => s.NumberGroupId).ToList();
}
```

> Группировка выполняется по `NumberGroupId` с использованием LINQ.

---

### 4.3. Создание и заполнение документа Word

Полный метод `BnExportWord_Click`:

```csharp
private void BnExportWord_Click(object sender, RoutedEventArgs e)
{
    List<Student> allStudents;
    List<Group> allGroups;

    using (UsersEntities usersEntities = new UsersEntities())
    {
        allStudents = usersEntities.Students.ToList().OrderBy(s => s.Name).ToList();
        allGroups = usersEntities.Groups.ToList().OrderBy(g => g.NumberGroup).ToList();
        var studentsCategories = allStudents.GroupBy(s => s.NumberGroupId).ToList();

        var app = new Word.Application();
        Word.Document document = app.Documents.Add();

        foreach (var group in studentsCategories)
        {
            // Заголовок группы
            Word.Paragraph paragraph = document.Paragraphs.Add();
            Word.Range range = paragraph.Range;
            var groupName = allGroups
                .Where(g => g.Id == group.Key)
                .FirstOrDefault()?.NumberGroup.ToString() ?? "Неизвестная группа";
            range.Text = groupName;
            paragraph.set_Style("Заголовок 1");
            range.InsertParagraphAfter();

            // Таблица студентов
            Word.Paragraph tableParagraph = document.Paragraphs.Add();
            Word.Range tableRange = tableParagraph.Range;
            Word.Table studentsTable = document.Tables.Add(tableRange, group.Count() + 1, 2);

            // Оформление таблицы
            studentsTable.Borders.InsideLineStyle = Word.WdLineStyle.wdLineStyleSingle;
            studentsTable.Borders.OutsideLineStyle = Word.WdLineStyle.wdLineStyleSingle;
            studentsTable.Range.Cells.VerticalAlignment = Word.WdCellVerticalAlignment.wdCellAlignVerticalCenter;

            // Заголовки колонок
            Word.Range cellRange = studentsTable.Cell(1, 1).Range;
            cellRange.Text = "Порядковый номер";
            cellRange = studentsTable.Cell(1, 2).Range;
            cellRange.Text = "ФИО";
            studentsTable.Rows[1].Range.Bold = 1;
            studentsTable.Rows[1].Range.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;

            // Заполнение данными
            int i = 1;
            foreach (var currentStudent in group)
            {
                cellRange = studentsTable.Cell(i + 1, 1).Range;
                cellRange.Text = currentStudent.Id.ToString();
                cellRange.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;

                cellRange = studentsTable.Cell(i + 1, 2).Range;
                cellRange.Text = currentStudent.Name;
                cellRange.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;
                i++;
            }

            // Итоговая строка
            Word.Paragraph countStudentsParagraph = document.Paragraphs.Add();
            Word.Range countStudentsRange = countStudentsParagraph.Range;
            countStudentsRange.Text = $"Количество студентов в группе — {group.Count()}";
            countStudentsRange.Font.Color = Word.WdColor.wdColorDarkRed;
            countStudentsRange.InsertParagraphAfter();

            // Разрыв страницы
            document.Words.Last.InsertBreak(Word.WdBreakType.wdPageBreak);
        }

        // Отображение и сохранение
        app.Visible = true;
        document.SaveAs2(@"D:\outputFileWord.docx");
        document.SaveAs2(@"D:\outputFilePdf.pdf", Word.WdExportFormat.wdExportFormatPDF);
    }
}
```

**Пояснение:**  
- Каждая группа размещается на отдельной странице (`wdPageBreak`).  
- Таблица создаётся с учётом количества студентов (`group.Count() + 1` — строка заголовков).  
- Ячейки выравниваются по центру, границы — сплошные.  
- Итоговая строка выделяется тёмно-красным цветом.  
- Документ сохраняется в двух форматах: `.docx` и `.pdf`.

---
