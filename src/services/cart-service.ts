import { db } from "@/db";
import { Cart, CartItem, cartItems, carts } from "@/db/schema/cart";
import ApiError from "@/utils/api-error";
import { CartItemsInsertValidation } from "@/validation/cart";
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

  async addProductToCart(
    productData: CartItemsInsertValidation,
    userId: number
  ) {
    try {
      const getCart = await this.getOrCreateCart(userId);

      const findTheProductCart = getCart.cart_items?.find(
        (item) => item?.productId === productData.productId
      );

      if (findTheProductCart) {
        return this.updateProductQuantity(
          productData.productId,
          findTheProductCart.quantity + 1
        );
      } else {
        return await db
          .insert(cartItems)
          .values({ ...productData })
          .returning();
      }
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to get or create cart");
    }
  }

  async deleteProductFromCart(productId: string) {
    try {
      return await db
        .delete(cartItems)
        .where(eq(cartItems.productId, productId));
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to delete product from cart");
    }
  }

  async updateProductQuantity(productId: string, quantity: number) {
    try {
      return await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.productId, productId))
        .returning();
    } catch (error: any) {
      throw new ApiError(error.message || "Failed to update product quantity");
    }
  }
}
