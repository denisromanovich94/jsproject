import { TaskList } from "./TaskList.js";
import { TaskListStore } from "./TaskStore.js";
import { TaskListRepository } from "./TaskRepository.js";

export async function setupTaskList() {
  try {
    const repository = new TaskListRepository();
    const taskListStore = new TaskListStore(repository);
    await taskListStore.fetchTasks();
    const taskList = new TaskList(taskListStore);
    taskList.renderTasks();
    taskList.init();
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error.message);
  }
}