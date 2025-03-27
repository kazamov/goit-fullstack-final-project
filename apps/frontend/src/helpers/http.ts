import type { ZodSchema } from 'zod';

import { tryCatch } from './catchError';
import HttpError from './HttpError';

const HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

interface RequestOptions extends RequestInit {
  schema?: ZodSchema;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  options.headers = {
    ...HEADERS,
    ...options.headers,
  };
  options.credentials = 'same-origin';

  const [responseError, responseData] = await tryCatch<T>(
    fetch(url, options).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new HttpError(data.message, response.status, data.errors);
      }
      return data;
    }),
  );

  if (responseError) {
    throw responseError;
  }

  const { schema } = options as RequestOptions;

  if (schema) {
    const { error, data } = schema.safeParse(responseData);

    if (error) {
      throw new Error('Data validation error');
    }
    return data;
  }

  return responseData;
}

export function get<T>(
  url: string,
  options: Omit<RequestOptions, 'method'> = {},
): Promise<T> {
  return request(url, {
    ...options,
    method: 'GET',
  });
}

export function post<T>(
  url: string,
  body: unknown,
  options: Omit<RequestOptions, 'method'> = {},
): Promise<T> {
  return request(url, {
    body: body as BodyInit,
    method: 'POST',
    ...options,
  });
}

export function put<T>(
  url: string,
  body: unknown,
  options: Omit<RequestOptions, 'method'> = {},
): Promise<T> {
  return request(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function del(url: string, options: Omit<RequestInit, 'method'> = {}) {
  return request(url, {
    ...options,
    method: 'DELETE',
  });
}

export function patch<T>(
  url: string,
  body: unknown,
  options: Omit<RequestInit, 'method'> = {},
): Promise<T> {
  return request(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
