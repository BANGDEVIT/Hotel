import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
  statusCode: number;
  message: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext, // ← thông tin về request hiện tại
    next: CallHandler, // ← đại diện cho controller phía sau
  ): Observable<Response<T>> {
    return next.handle().pipe(
      // ← sau khi controller chạy xong thì...
      map((data) => ({
        // ← data = giá trị controller return về
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Success',
        data, // ← wrap data vào đây
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
