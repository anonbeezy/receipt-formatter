import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine the status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the error message
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // Log the error with different levels based on status
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'GlobalExceptionFilter',
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${message}`,
        'GlobalExceptionFilter',
      );
    }

    // Send the error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      // Add more details in development environment only
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception.stack,
      }),
    });
  }
}
