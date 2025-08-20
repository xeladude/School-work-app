let tasks = [];

document.getElementById("task-form").addEventListener("submit", function (e){
    e.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    
    const subject = document.getElementById("task-subject").value.trim();
    
    const dueDate = document.getElementById("task-date").value.trim();

    if (title&&subject&&dueDate){
        tasks.push({
            id: Date.now(),
            title,
            subject,
            dueDate,
            completed:false,
        });
        this.reset();
        renderTasks();
    }

});

function renderTasks(){
    const tableBody = document.getElementById("tasks-body");

    tableBody.innerHTML = "";

    tasks
        .forEach(task =>{
            const row = document.createElement("tr");
            
            const titleCell = document.createElement("th");
            titleCell.textContent=task.title;
            if (task.completed)titleCell.classList.add("task-completed")
           
            const subjectCell = document.createElement("th");
            subjectCell.textContent=task.subject;
            if (task.completed)subjectCell.classList.add("task-completed")
            
            const dueDateCell = document.createElement("th");
            dueDateCell.textContent=task.dueDate;
            if (task.completed)dueDateCell.classList.add("task-completed")

        })
};



































