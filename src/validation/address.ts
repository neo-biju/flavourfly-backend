import { z } from "zod";

export const addressSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().max(20),
  isDefault: z.boolean().optional(),
  streetAddress: z.string().max(255),
  apartment: z.string().max(100).optional(),
  city: z.string().max(100),
  state: z.string().max(100),
  country: z.string().max(100),
  postalCode: z.string().max(20),
  phone: z.string().max(20),
});

export type AddressInsertSchema = z.infer<typeof addressSchema>;

export const defaultAddressSchema = z.object({
  addressId: z.string().uuid(),
});

export type DefaultAddressSchema = z.infer<typeof defaultAddressSchema>;

export const updateAddressSchema = addressSchema.extend({
  id: z.string().uuid(),
});

export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;
