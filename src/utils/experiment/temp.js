const zod = require("zod");

const createBlog = zod.object({
  body: zod
    .object({
      title: zod.string({
        required_error: "blog title is required",
        invalid_type_error: "blog title must be a string",
      }),
      description: zod.string({
        required_error: "blog description is required",
        invalid_type_error: "blog description must be a string",
      }),
      coverImage: zod.object({
        image: zod.object({
          size: zod.string({
            invalid_type_error: "image size must be a string",
          }),
          name: zod.string({
            invalid_type_error: "image name must be a string",
          }),
          type: zod.string({
            invalid_type_error: "image type must be a string",
          }),
          url: zod.string({
            invalid_type_error: "image url must be a string",
          }),
          id: zod.string({
            invalid_type_error: "image id must be a string",
          }),
        }),
        caption: zod.string({
          invalid_type_error: "caption must be a string",
        }),
      }),
      introduction: zod.string({
        required_error: "blog introduction is required",
        invalid_type_error: "blog introdustion must be a string",
      }),
      blogBody: zod.string({
        required_error: "blog body is required",
        invalid_type_error: "blog body must be a string",
        // length validation  == ??
      }),
      quote: zod.string({
        invalid_type_error: "quote must be a string",
      }),
      conclusion: zod.string({
        required_error: "a conclusion is required",
        invalid_type_error: "conclusion must be a string",
      }),
      conclusionImage: zod.object({
        image: zod.object({
          size: zod.string({
            invalid_type_error: "image size must be a string",
          }),
          name: zod.string({
            invalid_type_error: "image name must be a string",
          }),
          type: zod.string({
            invalid_type_error: "image type must be a string",
          }),
          url: zod.string({
            invalid_type_error: "image url must be a string",
          }),
          id: zod.string({
            invalid_type_error: "image id must be a string",
          }),
        }),
        caption: zod.string({
          invalid_type_error: "caption must be a string",
        }),
      }),
      thumbnail: zod.object({
        size: zod.string({
          invalid_type_error: "image size must be a string",
        }),
        name: zod.string({
          invalid_type_error: "image name must be a string",
        }),
        type: zod.string({
          invalid_type_error: "image type must be a string",
        }),
        url: zod.string({
          invalid_type_error: "image url must be a string",
        }),
        id: zod.string({
          invalid_type_error: "image id must be a string",
        }),
      }),
      category: zod.object({
        id: zod.string({
          required_error: "hire_type is required",
          invalid_type_error: "hire_type must be a string",
        }),
        name: zod.string({
          required_error: "hire_type is required",
          invalid_type_error: "hire_type must be a string",
        }),
      }),
      keywords: zod.array(zod.string()),
      writerInfo: zod.object({
        writerName: zod.string({
          required_error: "writerName user id is required",
          invalid_type_error: "writerName must be a string",
        }),
        writeTitle: zod.string({
          required_error: "writeTitle user id is required",
          invalid_type_error: "writeTitle must be a string",
        }),
        writerImage: zod.object({
          size: zod.string({
            invalid_type_error: "image size must be a string",
          }),
          name: zod.string({
            invalid_type_error: "image name must be a string",
          }),
          type: zod.string({
            invalid_type_error: "image type must be a string",
          }),
          url: zod.string({
            invalid_type_error: "image url must be a string",
          }),
          id: zod.string({
            invalid_type_error: "image id must be a string",
          }),
        }),
        writerCompany: zod.string(),
      }),
      isFeatured: zod.boolean(),
      isActive: zod.boolean(),
      readTime: zod.number().optional(),
      readCount: zod.number().optional(),
    })
    .strict(),
});

module.exports = {
  createBlog,
};
