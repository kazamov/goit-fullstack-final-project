export function tryCatch<T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error, undefined]> {
  return promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((error) => [error as Error, undefined]);
}
