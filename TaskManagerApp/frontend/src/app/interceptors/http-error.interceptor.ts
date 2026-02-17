import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred!';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        errorMessage = error.error?.message || 'Bad Request. Please check your input.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized. Please login again.';
                        break;
                    case 403:
                        errorMessage = 'Forbidden. You do not have permission to access this resource.';
                        break;
                    case 404:
                        errorMessage = 'Resource not found.';
                        break;
                    case 409:
                        errorMessage = error.error?.message || 'Conflict. This resource might already exist.';
                        break;
                    case 500:
                        errorMessage = error.error?.message || 'Internal Server Error. Please try again later.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
            }

            console.error(errorMessage);
            alert(errorMessage); // Simple alert for now, could be replaced with a toast service

            return throwError(() => new Error(errorMessage));
        })
    );
};
