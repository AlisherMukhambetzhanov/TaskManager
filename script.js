$(document).ready(function() {
    // Инициализация календаря
    $("#calendar").datepicker({
        onSelect: function(dateText) {
            getTasksByDateRange(dateText);
        }
    });

    $('#tasks-list').on('click', '.task', function() {
        // Добавьте информацию о задаче в модальное окно
        $("#taskDescription").text("Описание для задачи " + $(this).text());
        // Откройте модальное окно
        $("#taskModal").show();
    });

    // Закрытие модального окна при клике на крестик
    $('.close').on('click', function() {
        $("#taskModal").hide();
    });

    // Закрытие модального окна при клике за его пределами
    $(window).on('click', function(event) {
        if ($(event.target).is('#taskModal')) {
            $("#taskModal").hide();
        }
    });

    // Обработчик поиска задач
    $("#search-box").on("input", function() {
        let query = $(this).val();
        searchTasks(query);
    });

    // Обработчик для кнопки задач на сегодня
    $("#today-tasks").click(function() {
        getTasksForToday();
    });

    // Обработчик для кнопки задач на эту неделю
    $("#week-tasks").click(function() {
        getTasksForThisWeek();
    });
});

function searchTasks(query) {
    $.get(`http://localhost:8000/api/todos/find?q=${query}`, function(data) {
        displayTasks(data);
    });
}

function getTasksForToday() {
    let today = new Date();
    getTasksByDateRange(formatDate(today));
}

function getTasksForThisWeek() {
    let currentDate = new Date();
    let weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    let weekEnd = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
    getTasksByDateRange(formatDate(weekStart), formatDate(weekEnd));
}

function getTasksByDateRange(startDate, endDate = startDate) {
    $.get(`http://localhost:8000/api/todos/date?from=${new Date(startDate).getTime()}&to=${new Date(endDate).getTime()}`, function(data) {
        displayTasks(data);
    });
}

function displayTasks(tasks) {
    let tasksList = $("#tasks-list");
    tasksList.empty();

    tasks.forEach(task => {
        let taskElement = $('<div></div>').addClass('task').text(task.name);
        // Добавьте здесь дополнительную информацию о задаче
        tasksList.append(taskElement);
    });
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Получите модальное окно
let modal = document.getElementById("taskModal");

// Получите элемент <span>, который закрывает модальное окно
let span = document.getElementsByClassName("close")[0];

// Когда пользователь нажимает на задачу, откройте модальное окно
$('.task').on('click', function() {
  // Здесь вы можете добавить информацию о задаче в модальное окно
  document.getElementById("taskDescription").innerHTML = "Описание для задачи " + $(this).text();
  modal.style.display = "block";
});

// Когда пользователь нажимает на <span> (x), закройте модальное окно
span.onclick = function() {
  modal.style.display = "none";
}

// Когда пользователь нажимает в любом месте за пределами модального окна, закройте его
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
