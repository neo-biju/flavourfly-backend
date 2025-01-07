import { z } from "zod";

export const cartItemsInsertValidation = z.object({
  productId: z.string().max(255),
  productName: z.string().max(255),
  productImage: z.string().max(255).optional(),
  quantity: z.number().int().min(1).default(1),
  price: z.string(),
});

export type CartItemsInsertValidation = z.infer<
  typeof cartItemsInsertValidation
>;
