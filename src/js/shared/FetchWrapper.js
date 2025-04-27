class FetchWrapper {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    async get(url) {
      const response = await fetch(`${this.baseUrl}${url}`);
      return response.json();
    }
  
    async post(endpoint, data) {
      const url = `${this.baseUrl}/${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Что-то пошло не так");
      }
      return response.json();
    }
  

    async patch(endpoint, id, data) {
      const url = `${this.baseUrl}/${endpoint}/${id}`;
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Ошибка обновления задачи");
      }
      return response.json();
    }

    async delete(endpoint, id) {
      const url = `${this.baseUrl}/${endpoint}/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Ошибка удаления: ${response.status}`);
      }
      if (response.status === 200) return null;
    }
  }
  
  export const api = new FetchWrapper("https://5a06d2336f6db0ec.mokky.dev");