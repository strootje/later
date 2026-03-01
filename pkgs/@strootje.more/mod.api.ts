import type { StandardSchemaV1 as SS } from "@standard-schema/spec";

const validateSync = (schema: SS, data: unknown) => {
  const result = schema["~standard"].validate(data);

  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous");
  }

  if (result.issues) {
    console.error("validate/error", result);
    throw result.issues;
  }

  return result.value;
};

export const map = <TSchema extends SS, TOut>(
  schema: TSchema,
  func: (opts: SS.InferOutput<TSchema>) => TOut,
) => {
  return (input: SS.InferInput<TSchema>) => {
    return func(validateSync(schema, input));
  };
};

export const reqres = <TIn extends SS, TOut extends SS>(
  schema: { req: TIn; res: TOut },
  func: (opts: SS.InferOutput<TIn>) => Promise<Response>,
) => {
  return async (input: SS.InferInput<TIn>): Promise<SS.InferOutput<TOut>> => {
    const result = await func(validateSync(schema.req, input));

    return validateSync(schema.res, await result.json());
  };
};
