const messageList: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

export interface FieldError {
  field: string;
  message: string;
}

class HttpError extends Error {
  status: number;
  errors?: FieldError[];

  constructor(message: string, status: number, errors?: FieldError[]) {
    super(message ?? messageList[status] ?? 'Server Error');
    this.status = status;
    this.errors = errors;
  }
}

export default HttpError;
