import { db } from "@/db";
import { Cart, CartItem, cartItems, carts } from "@/db/schema/cart";
import ApiError from "@/utils/api-error";
import { and, eq } from "drizzle-orm";

type CartResponse = Cart & {
  cart_items: CartItem[] | null;
};

export class CartService {
  async getOrCreateCart(userId: number): Promise<CartResponse> {
    try {
      const cartSearch = await db
        .select()
        .from(carts)
        .where(and(eq(carts.userId, userId), eq(carts.status, "active")))
        .leftJoin(cartItems, eq(cartItems.cartId, carts.id));

      if (cartSearch.length === 0) {
        // Create new cart if none exists
        const [newCart] = await db
          .insert(carts)
          .values({
            userId,
            status: "active",
          })
          .returning();

        return {
          ...newCart,
          cart_items: [],
        };
      }

      const cartItemsArray = cartSearch
        .map((row) => row.cart_items)
        .filter((item) => item !== null);

      const cart: CartResponse = {
        ...cartSearch[0].carts,
        cart_items: cartItemsArray,
      };

      return cart;
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to get or create cart");
    }
  }
}
