export class TelegramBotException extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: Record<string, any>,
  ) {
    super(message);
  }
}
