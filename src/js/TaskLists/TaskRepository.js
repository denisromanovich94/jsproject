import { api } from "../shared/FetchWrapper.js";

export class TaskListRepository {
async fetchTasks() {
    try {
        return await api.get("/tasks");
    }
    catch (error) {
        throw new Error("нет задач");
    }
}


async addTask(text) {
    try {
        return await api.post("tasks", {text});
    } 
    catch (error) {
throw new Error("не удалось добавить задачу");
    }
}



async updateTask(id, data) {
    try {
        return await api.put("tasks", id, data);
    }
    catch (error) {
        throw new Error("не удалось обновить задачу");
    }
}



async deleteTask(id) {
    try {
        return await api.delete("tasks", id);
    }
    catch (error) {
        throw new Error("не удалось удалить задачу");
    }
}







}