import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppCommunicationError } from '@core/infrastructure/errors/app-comunication.error';
import { ApiResponseDTO } from '../dto/api-response.dto';
import { ApiResponseMapper } from '../mappers/api-response.mapper';
import {
  ApiResponse,
  ApiResponseWithPagination,
} from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorHandlerService {
  // handleError intenta formatear errores de negocio del backend en un ApiResponse sin romper el flujo de la aplicación.
  handleError<T>(
    error: HttpErrorResponse
  ): ApiResponse<T> | ApiResponseWithPagination<T> {
    const isApiError =
      error.error && 'angular' in error.error && error.error.success === false;

    if (isApiError) {
      // eslint-disable-next-line no-console
      console.log('HandleError caught this ApiResponseDTO:', error.error);

      const backendErrorPayload = error.error as ApiResponseDTO<unknown>;
      const response = ApiResponseMapper.autoDetect<T>(backendErrorPayload);

      // eslint-disable-next-line no-console
      console.warn(
        '⚠️ Business error from backend (formatted as ApiResponse):',
        {
          url: error.url,
          response,
        }
      );

      return response;
    } else {
      return this.handleErrorHard(error);
    }
  }

  // para otros errores (red, errores críticos), delega a handleErrorHard que sí lanza una excepción y romple el flujo de la aplicación.
  handleErrorHard(error: any): never {
    const isNetworkError =
      error instanceof HttpErrorResponse && error.status === 0;

    const errorMessage = isNetworkError
      ? 'Network connection failed or server unreachable. Please check your connection.'
      : 'A critical communication error occurred with the server.';

    // eslint-disable-next-line no-console
    console.error('💥 Critical error when making request:', {
      url: error?.url,
      status: error?.status,
      message: error?.message,
      isNetworkError,
      error,
      originalErrorObject: error,
    });

    // Lanza un error para que otra capa lo maneje.
    // Los consumidores de tus servicios API podrán hacer catchError(err => ...) y verificar if (err instanceof AppCommunicationError && err.isNetworkError) para reaccionar de forma diferente a problemas de red vs. otros errores críticos del servidor.
    throw new AppCommunicationError(errorMessage, error, isNetworkError);
  }
}
