const { zod } = require("zod");

const fileZodSchema = zod.object({
  file_id: zod.string({
    required_error: "File id is required",
    invalid_type_error: "File is must be string",
  }),
  file_name: zod.string({
    required_error: "File name is required",
    invalid_type_error: "File name must be string",
  }),
  file_type: zod.string({
    required_error: "File type is required",
    invalid_type_error: "File type must be string",
  }),
  file_size: zod.string({
    required_error: "File size is required",
    invalid_type_error: "File size must be string",
  }),
  file_url: zod.string({
    required_error: "File url is required",
    invalid_type_error: "File url must be string",
  }),
});

module.exports = fileZodSchema;
