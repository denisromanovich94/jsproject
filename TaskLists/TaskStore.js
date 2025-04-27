import { TaskListRepository } from "./TaskRepository.js";

export class TaskListStore {
  #tasks = [];
  #repository;

  constructor(repository) {
    if(!(repository instanceof TaskListRepository)) {
      throw new Error("Ожидаем таск лист репозитори");
    }
    this.#repository = repository;
  }


  
  async fetchTasks() {
    this.#tasks = await this.#repository.fetchTasks();
    return this.#tasks;
  }

  async addTask(text) {
    const newTask = await this.#repository.addTask(text);
    this.#tasks.push(newTask);
    return newTask;
  }

  async markTaskAsDone(id, text) {
    const taskExists = this.#tasks.some(task => task.id === id);
    if (!taskExists) {
      throw new Error(`Задача с ID ${id} не найдена`);
    }
    await this.#repository.updateTask(id, { text, done: true });
    this.#tasks = this.#tasks.map(task =>
      task.id === id ? { ...task, done: true } : task
    );
  }

  async deleteTask(id) {

    const taskExists = this.#tasks.some(task => task.id === id);
    if (!taskExists) {
      throw new Error(`Задача с ID ${id} не найдена`);
    }
    await this.#repository.deleteTask(id);
    this.#tasks = this.#tasks.filter(task => task.id !== id);
  }

  getTasks() {
    return this.#tasks;
  }
}