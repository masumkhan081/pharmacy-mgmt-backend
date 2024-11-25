import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodIssue } from "zod"; // Assuming you're using Zod for validation

// Type for the schema validation middleware
const validateRequest =
  (requestBodySchema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const valid = requestBodySchema.safeParse(req.body);

      if (valid.success) {
        console.log("valid::    ");
        return next();
      } else {
        // Stringify the errors for debugging, though it's not needed here.
        console.log("invalid:  ");
        const messages: { [key: string]: string[] } = {}; // Store validation messages per field

        const issues = valid.error.issues;

        // Loop through issues and organize them in messages
        issues.forEach((issue: ZodIssue) => {
          const issueKey = issue.path[0]; // Path is an array, take the first element as the key
          if (messages[issueKey]) {
            messages[issueKey].push(issue.message); // Push message to existing key
          } else {
            messages[issueKey] = [issue.message]; // Initialize with the first message
          }
        });

        // Send validation error response
        return res.status(400).json({
          success: false,
          message: "Invalid data",
          messages,
          type: "ZodError",
        });
      }
    } catch (error) {
      // Catching any errors in the validation process
      console.error(
        "Error processing Zod schema: " +
          (error instanceof Error ? error.message : "Unknown error")
      );

      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }
  };

export default validateRequest;
