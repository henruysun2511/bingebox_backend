export class AppError extends Error {
  statusCode: number;
  messages: string[];

  constructor(messages: string[] | string, statusCode = 400) {
    super(Array.isArray(messages) ? messages.join(", ") : messages);
    this.statusCode = statusCode;
    this.messages = Array.isArray(messages) ? messages : [messages];
  }
}