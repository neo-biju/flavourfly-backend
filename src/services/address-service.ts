import { db } from "@/db";
import { addresses } from "@/db/schema/address";
import ApiError from "@/utils/api-error";
import { AddressInsertSchema, UpdateAddressSchema } from "@/validation/address";
import { and, eq } from "drizzle-orm";

class AddressService {
  async getAllAddress(userId: string) {
    try {
      const result = db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, userId));
      return result;
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to get addresses");
    }
  }

  async getAddressById(id: string) {
    try {
      const result = await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, id));
      return result[0] || null;
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to get the address");
    }
  }

  async createAddress(addressData: AddressInsertSchema) {
    try {
      return await db.transaction(async (tx) => {
        if (addressData.isDefault) {
          await db
            .update(addresses)
            .set({ isDefault: false })
            .where(eq(addresses.userId, addressData.userId));
        }
        const result = await tx
          .insert(addresses)
          .values(addressData)
          .returning();
        return result;
      });
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to create the address");
    }
  }

  async removeAddressById(id: string) {
    try {
      const result = await db
        .delete(addresses)
        .where(eq(addresses.id, id))
        .returning();
      return result;
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to remove the address");
    }
  }

  async setDefaultAddress(addressId: string, userId: string) {
    try {
      return await db.transaction(async (tx) => {
        // First verify the address exists and belongs to the user
        const addressExists = await tx
          .select()
          .from(addresses)
          .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
          .limit(1);

        if (!addressExists.length) {
          throw new ApiError("Address not found or doesn't belong to user");
        }

        // Set all addresses for this user to non-default
        await tx
          .update(addresses)
          .set({ isDefault: false })
          .where(eq(addresses.userId, userId));

        // Set the specified address as default
        const result = await tx
          .update(addresses)
          .set({ isDefault: true })
          .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
          .returning();

        return result[0];
      });
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to remove the address");
    }
  }

  async updateAddress(updateData: UpdateAddressSchema) {
    try {
      return await db.transaction(async (tx) => {
        // First verify the address exists and belongs to the user
        const existingAddress = await tx
          .select()
          .from(addresses)
          .where(
            and(
              eq(addresses.id, updateData.id),
              eq(addresses.userId, updateData.userId)
            )
          )
          .limit(1);

        if (!existingAddress.length) {
          throw new ApiError(
            "Address not found or doesn't belong to user",
            404
          );
        }

        // If updating to default address, handle the default address logic
        if (updateData.isDefault) {
          await tx
            .update(addresses)
            .set({ isDefault: false })
            .where(eq(addresses.userId, updateData.userId));
        }

        // If this is the only address, force it to be default
        const allAddresses = await tx
          .select()
          .from(addresses)
          .where(eq(addresses.userId, updateData.userId));

        if (allAddresses.length === 1 && updateData.isDefault === false) {
          updateData.isDefault = true; // Force single address to be default
        }

        // Update the address
        const result = await tx
          .update(addresses)
          .set(updateData)
          .where(
            and(
              eq(addresses.id, updateData.id),
              eq(addresses.userId, updateData.userId)
            )
          )
          .returning();

        return result[0];
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || "Failed to update the address", 500);
    }
  }
}

export default AddressService;
