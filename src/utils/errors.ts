import * as Sentry from "@sentry/nextjs";

export async function catchAsync(fn: Function, options: { name: string, operation: string }) {
  return await Sentry.startSpan({
    name: options.name,
    op: options.operation
  }, async () => {
    try {
      return await fn();
    } catch (err) {
      throw err;
    }
  });
}