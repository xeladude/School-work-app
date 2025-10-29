window.addEventListener("DOMContentLoaded", ()=>{


    let tasks = [];
    let currentEditingTaskID = null;
    // window.electronAPI.readTasks().then((loadedTasks) => {
    //     tasks = loadedTasks || [];
    //     renderTasks();
    // });
    // window.API.getTasks().then(savedTasks => {
    //     tasks = savedTasks;
    //     renderTasks(); 
    // });
    //window.API.saveTasks(tasks);
    document.getElementById("task-form").addEventListener("submit", function (e){
        e.preventDefault();

        const title = document.getElementById("task-title").value.trim();
        
        const subject = document.getElementById("task-subject").value.trim();
        
        const dueDate = document.getElementById("task-date").value.trim();
        // const savedTasks = await window.api.getTasks();
        
        // window.electronAPI.readTasks().then((loadedTasks) => {
        //     tasks = loadedTasks || [];
        //     renderTasks();
        // });

        if (title&&subject&&dueDate){
            tasks.push({
                id: Date.now(),
                title,
                notes : "",
                subject,
                dueDate,
                completed:false,
            });
            this.reset();
            renderTasks();
            window.electronAPI.saveTasks(tasks);
        }

    });



    function renderTasks(){
        const tableBody = document.getElementById("tasks-body");

        tableBody.innerHTML = "";

        tasks
            .forEach(task =>{
                const row = document.createElement("tr");
                
                const titleCell = document.createElement("td");
                titleCell.textContent=task.title;
                if (task.completed)titleCell.classList.add("task-completed")
            
                const subjectCell = document.createElement("td");
                subjectCell.textContent=task.subject;
                if (task.completed)subjectCell.classList.add("task-completed")
                
                const dueDateCell = document.createElement("td");
                dueDateCell.textContent=task.dueDate;
                if (task.completed)dueDateCell.classList.add("task-completed")

                const completedCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;

                checkbox.addEventListener("change", () => {
                    task.completed = checkbox.checked;
                    renderTasks();
                    window.electronAPI.saveTasks(tasks);
                });
                completedCell.appendChild(checkbox);
                if (task.completed){
                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.className = "remove-button";
                    removeButton.addEventListener("click",() => {
                        tasks = tasks.filter(t => t.id !== task.id)
                        renderTasks()
                        window.electronAPI.saveTasks(tasks);
                    });
                    completedCell.appendChild(removeButton);
                }

                const notesCell = document.createElement("td");
                const notesButton = document.createElement("button");
                notesButton.textContent = "📝";
                notesButton.className = "notes-button";
                notesButton.addEventListener("click", () => openNotesModal(task.id));
                notesCell.appendChild(notesButton);
                
                row.appendChild(titleCell);
                row.appendChild(subjectCell);
                row.appendChild(dueDateCell);
                row.appendChild(notesCell)
                row.appendChild(completedCell);

                tableBody.appendChild(row);

            });  
    }


    function openNotesModal(taskID){
        currentEditingTaskID = taskID;
        const task = tasks.find(t => t.id === taskID);
        document.getElementById("notes-text").value = task.notes || "";
        document.getElementById("notes-modal").classList.remove("hidden");
        
        // find the task ID, then display notes modal
    }

    function closeNotesModal(){
        currentEditingTaskID = null;
        document.getElementById("notes-modal").classList.add("hidden")
        // close it (duh)
    }

    // configure modal buttons
    document.getElementById("save-note").addEventListener("click", () => {
        const task = tasks.find (t => t.id === currentEditingTaskID);
        task.notes = document.getElementById("notes-text").value.trim();
        closeNotesModal();
        renderTasks();
        window.electronAPI.saveTasks(tasks);
        //kinda do the same as openNotesModal function

    })

    document.getElementById("cancel-note").addEventListener("click", closeNotesModal);

    renderTasks();

});






























