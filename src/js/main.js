import { TaskList } from "./TaskLists/TaskList.js";
import { TaskListStore } from "./TaskLists/TaskStore.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const taskListStore = new TaskListStore();
    await taskListStore.fetchTasks();
    const taskList = new TaskList(taskListStore); 
    taskList.renderTasks();
    taskList.init();
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error.message);
  }
});