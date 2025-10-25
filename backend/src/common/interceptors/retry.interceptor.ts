import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { retry, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RetryInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    return next.handle().pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          this.logger.warn(
            `Retry attempt ${retryCount}/${maxRetries} for ${context.getHandler().name}`,
          );
          return timer(retryDelay * retryCount);
        },
      }),
      catchError(error => {
        this.logger.error(
          `All retry attempts failed for ${context.getHandler().name}`,
          error.stack,
        );
        return throwError(() => error);
      }),
    );
  }
}
