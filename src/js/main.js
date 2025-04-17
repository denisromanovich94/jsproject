import { api } from "/src/js/FetchWrapper.js";

const form = document.querySelector("#form");
const taskInput = document.querySelector(".input-text");
const tasksList = document.querySelector(".tasks");
const tasksListDone = document.querySelector(".done-tasks");

let tasksJSON = [];

async function fetchTasks() {
    try {
        const tasks = await api.get("/tasks");
        return tasks;
    } catch (error) {
        throw new Error("Не удалось получить задачи");
    }
}

function renderTasks() {
    let html = "";

    tasksJSON.forEach((task) => {
        const { id, text } = task;
        html += `<div class="task__item" id="task-${id}">
          <p class="task__text">${text}</p>
          <div class="btn-cont">
            <button data-action="done" class="task-btn"><svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.7851 1.67391L6.78513 12.6739C6.72128 12.7378 6.64546 12.7885 6.56199 12.8231C6.47853 12.8577 6.38907 12.8755 6.29872 12.8755C6.20837 12.8755 6.11891 12.8577 6.03545 12.8231C5.95199 12.7885 5.87617 12.7378 5.81232 12.6739L0.999816 7.86141C0.870813 7.7324 0.79834 7.55744 0.79834 7.375C0.79834 7.19256 0.870813 7.0176 0.999816 6.88859C1.12882 6.75959 1.30378 6.68712 1.48622 6.68712C1.66866 6.68712 1.84363 6.75959 1.97263 6.88859L6.29872 11.2155L16.8123 0.701094C16.9413 0.572091 17.1163 0.499619 17.2987 0.499619C17.4812 0.499619 17.6561 0.572091 17.7851 0.701094C17.9141 0.830097 17.9866 1.00506 17.9866 1.1875C17.9866 1.36994 17.9141 1.5449 17.7851 1.67391Z" fill="#9E78CF" />
            </svg></button>
            <button data-action="delete" class="task-btn"><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.6112 3.125H1.48622C1.30388 3.125 1.12902 3.19743 1.00009 3.32636C0.871154 3.4553 0.798721 3.63016 0.798721 3.8125C0.798721 3.99484 0.871154 4.1697 1.00009 4.29864C1.12902 4.42757 1.30388 4.5 1.48622 4.5H2.17372V16.875C2.17372 17.2397 2.31859 17.5894 2.57645 17.8473C2.83431 18.1051 3.18405 18.25 3.54872 18.25H14.5487C14.9134 18.25 15.2631 18.1051 15.521 17.8473C15.7789 17.5894 15.9237 17.2397 15.9237 16.875V4.5H16.6112C16.7936 4.5 16.9684 4.42757 17.0974 4.29864C17.2263 4.1697 17.2987 3.99484 17.2987 3.8125C17.2987 3.63016 17.2263 3.4553 17.0974 3.32636C16.9684 3.19743 16.7936 3.125 16.6112 3.125ZM14.5487 16.875H3.54872V4.5H14.5487V16.875ZM4.92372 1.0625C4.92372 0.880164 4.99615 0.705295 5.12509 0.576364C5.25402 0.447433 5.42888 0.375 5.61122 0.375H12.4862C12.6686 0.375 12.8434 0.447433 12.9724 0.576364C13.1013 0.705295 13.1737 0.880164 13.1737 1.0625C13.1737 1.24484 13.1013 1.4197 12.9724 1.54864C12.8434 1.67757 12.6686 1.75 12.4862 1.75H5.61122C5.42888 1.75 5.25402 1.67757 5.12509 1.54864C4.99615 1.4197 4.92372 1.24484 4.92372 1.0625Z" fill="#9E78CF" />
            </svg></button>
          </div>
        </div>`;
    });

    tasksList.innerHTML = html;
}

async function addTask(event) {
    event.preventDefault();
    const text = taskInput.value;

    taskInput.value = "";

    try {
        const newTask = await api.post("tasks", { text });
        tasksJSON.push(newTask);
        renderTasks();
    } catch (error) {
        console.error("Ошибка в addTask:", error.message);

        
        const errorMessage = document.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.innerHTML = "Ошибка: Не удалось добавить задачу";
            setTimeout(() => {
                errorMessage.innerHTML = "";
            }, 5000); 
        }
    }
}

async function removeTask(event) {
    const deleteButton = event.target.closest('[data-action="delete"]');
    if (deleteButton) {
        const parentNode = deleteButton.closest(".task__item");
        if (parentNode) {
            const taskId = parentNode.id.replace("task-", "");
            try {
                await api.delete("tasks", taskId);
                console.log("До фильтрации:", tasksJSON); 
                tasksJSON = tasksJSON.filter((task) => task.id != taskId);
                console.log("После фильтрации:", tasksJSON); 
                renderTasks();
            } catch (error) {
                console.error("Ошибка при удалении задачи:", error.message);
            }
        }
    }
}

async function doneTask(event) {
    const doneButton = event.target.closest('[data-action="done"]');
    if (doneButton) {
        const parentNode = doneButton.closest(".task__item");
        if (parentNode) {
            const taskId = parentNode.id.replace("task-", "");
            const taskText = parentNode.querySelector(".task__text").textContent;
            try {
                
                await api.put("tasks", taskId, { text: taskText, done: true });
                parentNode.remove();
                const taskHtml = `
                    <div class="task__item done-tasks">
                        <p class="task__text done-text">${taskText}</p>
                    </div>`;
                tasksListDone.insertAdjacentHTML("beforeend", taskHtml);
                tasksJSON = tasksJSON.map((task) =>
                    task.id == taskId ? { ...task, done: true } : task
                );
                console.log("После обновления:", tasksJSON);
            } catch (error) {
                console.error("Ошибка при выполнении задачи:", error.message);
                const errorMessage = document.querySelector(".error-message");
                if (errorMessage) {
                    errorMessage.innerHTML = "Ошибка: Не удалось отметить задачу как выполненную";
                    setTimeout(() => {
                        errorMessage.innerHTML = "";
                    }, 5000);
                }
            }
        }
    }
}






window.addEventListener("DOMContentLoaded", async () => {
    try {
        tasksJSON = await fetchTasks();
        renderTasks();
    } catch (error) {
        console.error("Ошибка при загрузке задач:", error.message);
        
    }
});

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", removeTask);
tasksList.addEventListener("click", doneTask);
