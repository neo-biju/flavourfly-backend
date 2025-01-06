import { z } from "zod";

export const googleValidation = z.object({
  accessToken: z
    .string({ message: "Access token is required" })
    .nonempty({ message: "Access token is required" }),
});

export type GoogleValidation = z.infer<typeof googleValidation>;
