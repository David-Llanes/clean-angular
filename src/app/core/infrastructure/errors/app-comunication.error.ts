import { HttpErrorResponse } from '@angular/common/http';

export class AppCommunicationError extends Error {
  constructor(
    message: string,
    public readonly originalError?: HttpErrorResponse | any,
    public readonly isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'AppCommunicationError';
  }
}
