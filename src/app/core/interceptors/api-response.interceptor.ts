import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { API_BASE_URLS_TO_INTERCEPT } from '@core/config/constants/api.constants';
import { ApiResponseDTO } from '@core/infrastructure/dto/api-response.dto';
import { ApiResponseMapper } from '@core/infrastructure/mappers/api-response.mapper';
import { ApiErrorHandlerService } from '@core/infrastructure/services/api-error-handler.service';
import { NO_INTERCEPT } from '../config/http-context-tokens';

export const apiResponseMapperInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (req.context.get(NO_INTERCEPT)) {
    return next(req);
  }

  const apiErrorHandler = inject(ApiErrorHandlerService);

  const isApiRequest = API_BASE_URLS_TO_INTERCEPT.some((apiUrl) =>
    req.url.startsWith(apiUrl)
  );

  // Si no es una URL que nos interesa interceptar, devolvemos el flujo original sin modificar
  if (!isApiRequest) {
    return next(req);
  }

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        const response = event.body as ApiResponseDTO<unknown>;

        const mappedResponse = ApiResponseMapper.autoDetect(response);

        return event.clone({ body: mappedResponse });
      }

      return event;
    }),
    catchError(
      (error: HttpErrorResponse): Observable<HttpResponse<unknown>> => {
        const formattedError = apiErrorHandler.handleError<unknown>(error);

        // Aqui solo llega si el formattedError es un ApiResponse. Si es un error crítico, se lanza una excepción y no se llega a este punto.
        const newResponse = new HttpResponse({
          body: formattedError,
          status: error.status,
          statusText: error.statusText ?? 'Bad request',
          headers: error.headers,
          url: error.url || undefined,
        });

        return of(newResponse);
      }
    )
  );
};
