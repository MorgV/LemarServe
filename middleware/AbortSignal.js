// AbortSignalHandler.js

class AbortSignalHandler {
  constructor(req) {
    // Создаём новый AbortController
    this.controller = new AbortController();
    this.signal = this.controller.signal;

    // Отслеживаем закрытие соединения для инициирования отмены
    this.listenToRequestClose(req);
  }

  // Метод для отслеживания закрытия запроса
  listenToRequestClose(req) {
    req.on("close", () => {
      console.log("Request was closed by client");
      this.abort(); // Отменяем все асинхронные операции
    });
  }

  // Метод для выполнения асинхронной операции с поддержкой отмены
  async executeAsyncOperation(asyncOperation) {
    try {
      return await asyncOperation(this.signal);
    } catch (err) {
      if (this.signal.aborted) {
        throw new Error("Operation aborted by client");
      }
      throw err;
    }
  }

  // Метод для отмены операции
  abort() {
    this.controller.abort();
  }

  // Метод для получения сигнала
  getSignal() {
    return this.signal;
  }
}

module.exports = AbortSignalHandler;
