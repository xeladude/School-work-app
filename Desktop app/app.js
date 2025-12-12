window.addEventListener("DOMContentLoaded", () => {

    let tasks = [];
    let activeSubject = null;
    let currentEditingTaskID = null;
    let customSubjects = [];



    document.getElementById("subjects-view").classList.remove("hidden");
    document.getElementById("task-form-section").classList.add("hidden");
    document.getElementById("section-table").classList.add("hidden");
    document.getElementById("back-button").classList.add("hidden");



    (async function firstLoad() {
        try {
            const loaded = await window.electronAPI.readTasks();
            tasks = Array.isArray(loaded) ? loaded : [];
            renderTasks();
            renderDashboard();
        } catch (e) {
            console.error("failed to load tasks", e);
            tasks = [];
            renderTasks();
            renderDashboard();
        }
    })();


    // Dashboard area
    function getUniqueSubjects() {
        const subjectSet = new Set(tasks.map(t => t.subject));

        customSubjects.forEach(s => subjectSet.add(s));

        return Array.from(subjectSet).sort();
    }


    function renderDashboard() {
        const grid = document.getElementById("subjects-grid");
        grid.innerHTML = "";

        const subjects = getUniqueSubjects();

        if (subjects.length === 0) {
            grid.innerHTML = "<p>No subjects yet!! Add a task to create a new one!</p>";
            return;
        }

        subjects.forEach(subject => {
            const tile = document.createElement("div");
            tile.className = "subject-tile";
            tile.textContent = subject;
            tile.addEventListener("click", () => selectSubject(subject));
            grid.appendChild(tile);
        });

        const addTile = document.createElement("div");
        addTile.className = "subject-tile add-tile";
        addTile.innerHTML = "➕";
        addTile.addEventListener("click", () => {
            document.getElementById("subject-input".value = "");
            document.getElementById("subject-modal").classList.remove("hidden");
        });
        grid.appendChild(addTile);
    }



    function selectSubject(subject) {
        activeSubject = subject;

        document.getElementById("subjects-view").classList.add("hidden");
        document.getElementById("task-form-section").classList.remove("hidden");
        document.getElementById("section-table").classList.remove("hidden");
        document.getElementById("back-button").classList.remove("hidden");

        const subjectInput = document.getElementById("task-subject");
        subjectInput.value = subject;
        subjectInput.disabled = true;

        renderTasks();
    }


    function backToDashboard() {
        activeSubject = null;

        document.getElementById("subjects-view").classList.remove("hidden");
        document.getElementById("task-form-section").classList.add("hidden");
        document.getElementById("section-table").classList.add("hidden");
        document.getElementById("back-button").classList.add("hidden");

        const subjectInput = document.getElementById("task-subject");
        subjectInput.disabled = false;
        subjectInput.value = "";

        renderDashboard();
    }


    document.getElementById("back-button").addEventListener("click", backToDashboard);

    // document.getElementById("add-subject").addEventListener("click", () => {
    //     document.getElementById("subject-input").value = "";
    //     document.getElementById("subject-modal").classList.remove("hidden");
    // });

    document.getElementById("save-subject").addEventListener("click", () => {
        const subjectName = document.getElementById("subject-input").value;

        if (!subjectName) return;
        const clean = subjectName.trim();
        if (!clean) return;

        if (customSubjects.includes(clean)) return;
        if (tasks.some(t => t.subject === clean)) return;

        customSubjects.push(clean);
        document.getElementById("subject-modal").classList.add("hidden");
        renderDashboard();
    });

    document.getElementById("cancel-subject").addEventListener("click", () => {
        document.getElementById("subject-modal").classList.add("hidden");
    });


    document.getElementById("task-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value.trim();
        const subjectInput = document.getElementById("task-subject");
        const subject = activeSubject || subjectInput.value.trim();
        const dueDate = document.getElementById("task-date").value.trim();

        if (!title || !subject || !dueDate) return;

        tasks.push({
            id: Date.now(),
            title,
            notes: "",
            subject,
            dueDate,
            completed: false,
        });

        this.reset();

        if (activeSubject) {
            subjectInput.value = activeSubject;
            subjectInput.disabled = true;
        }

        renderTasks();
        renderDashboard();
        try {
            await window.electronAPI.saveTasks(tasks);
        } catch (e) {
            console.error("Unable to save tasks: ", e);
        }
    });




    function renderTasks() {
        const tableBody = document.getElementById("tasks-body");
        tableBody.innerHTML = "";

        const visibleTasks = activeSubject
            ? tasks.filter(t => t.subject === activeSubject)
            : tasks;

        visibleTasks.forEach(task => {
            const row = document.createElement("tr");

            const titleCell = document.createElement("td");
            titleCell.textContent = task.title;
            if (task.completed) titleCell.classList.add("task-completed");

            const subjectCell = document.createElement("td");
            subjectCell.textContent = task.subject;
            if (task.completed) subjectCell.classList.add("task-completed");

            const dueDateCell = document.createElement("td");
            dueDateCell.textContent = task.dueDate;
            if (task.completed) dueDateCell.classList.add("task-completed");

            const completedCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", async () => {
                task.completed = checkbox.checked;
                renderTasks();
                try { await window.electronAPI.saveTasks(tasks); } catch (e) { console.error(e); }
            });

            completedCell.appendChild(checkbox);
            if (task.completed) {
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.className = "remove-button";
                removeButton.addEventListener("click", async () => {
                    tasks = tasks.filter(t => t.id !== task.id);
                    renderTasks();
                    try { await window.electronAPI.saveTasks(tasks); } catch (e) { console.error(e); }
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
            row.appendChild(notesCell);
            row.appendChild(completedCell);

            tableBody.appendChild(row);
        });
    }




    function openNotesModal(taskID) {
        currentEditingTaskID = taskID;
        const task = tasks.find(t => t.id === taskID);
        document.getElementById("notes-text").value = task?.notes || "";
        document.getElementById("notes-modal").classList.remove("hidden");
    }

    function closeNotesModal() {
        currentEditingTaskID = null;
        document.getElementById("notes-modal").classList.add("hidden");
    }

    document.getElementById("save-note").addEventListener("click", async () => {
        const task = tasks.find(t => t.id === currentEditingTaskID);
        if (task) {
            task.notes = document.getElementById("notes-text").value.trim();
        }
        closeNotesModal();
        renderTasks();
        try { await window.electronAPI.saveTasks(tasks); } catch (e) { console.error(e); }
    })

    document.getElementById("cancel-note").addEventListener("click", closeNotesModal);

    renderTasks();

});





const darkmode = document.getElementById("darkmode");

if (localStorage.getItem("darkmode")==="true"){
    document.body.classList.add("dark");
}

darkmode.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const enabled = document.body.classList.contains("dark");
    localStorage.setItem("darkmode", enabled);
});

























