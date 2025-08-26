import z from "zod/v4";

export const NotFoundSchema = z.object({
  message: z.string(),
});