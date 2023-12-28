$(document).ready(function() {
    // Инициализация календаря
    $("#calendar").datepicker({
        onSelect: function(dateText) {
            getTasksByDateRange(dateText);
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
