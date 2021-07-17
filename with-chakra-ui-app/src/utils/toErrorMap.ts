import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  // declare Record type with empty map
  const gqlErrorMap: Record<string, string> = {}; // Record -> Get specific type combinations
  errors.forEach(({field, message}) => {
    gqlErrorMap[field] = message
  });

  return gqlErrorMap;
}