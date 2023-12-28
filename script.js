$(document).ready(function() {
    $("#calendar").datepicker({
        onSelect: function(dateText) {
            getTasksByDateRange(dateText);
        }
    });

    $('#tasks-list').on('click', '.task', function() {
        $("#taskDescription").text("Описание для задачи " + $(this).text());
        // Откройте модальное окно
        $("#taskModal").show();
    });

    $('.close').on('click', function() {
        $("#taskModal").hide();
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#taskModal')) {
            $("#taskModal").hide();
        }
    });

    $("#search-box").on("input", function() {
        let query = $(this).val();
        searchTasks(query);
    });

    $("#today-tasks").click(function() {
        getTasksForToday();
    });

    $("#week-tasks").click(function() {
        getTasksForThisWeek();
    });

    let dateFormat = "mm/dd/yy",
        from = $( "#from" )
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on( "change", function() {
                to.datepicker( "option", "minDate", getDate( this ) );
            }),
        to = $( "#to" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
        .on( "change", function() {
            from.datepicker( "option", "maxDate", getDate( this ) );
        });
  
    function getDate( element ) {
        let date;
        try {
            date = $.datepicker.parseDate( dateFormat, element.value );
        } catch( error ) {
            date = null;
        }
        return date;
    }

    $('#range-tasks').click(function() {
        let startDate = $('#from').val();
        let endDate = $('#to').val();
        getTasksByDateRange(startDate, endDate);
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

let modal = document.getElementById("taskModal");

let span = document.getElementsByClassName("close")[0];


$('.task').on('click', function() {
  document.getElementById("taskDescription").innerHTML = "Описание для задачи " + $(this).text();
  modal.style.display = "block";
});

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

