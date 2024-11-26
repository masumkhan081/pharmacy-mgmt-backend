import z, { ZodError } from "zod";

interface ValidationResult {
  success: boolean;
  message?: string;
  messages?: Record<string, string>;
}

function validateData<T>({
  schema,
  data,
}: {
  schema: z.Schema<T>;
  data: unknown;
}): ValidationResult {
  try {
    const valid = schema.safeParse(data);

    if (valid.success) {
      return { success: true };
    }

    const messages: Record<string, string> = {};
    const issues = valid.error.issues;

    for (const issue of issues) {
      messages[issue.path[0]] = issue.message;
    }

    return {
      success: false,
      message: "Invalid data",
      messages,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle ZodError specifically
      return {
        success: false,
        message: "Invalid data",
        messages: error.issues.reduce(
          (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
          {},
        ),
      };
    } else {
      return {
        success: false,
      };
    }
  }
}

export default validateData;
