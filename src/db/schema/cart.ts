import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./etc";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  ...timestamps,
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => carts.id),
  productId: varchar("product_id", { length: 255 }).notNull(), // ID from frontend
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: varchar("product_image", { length: 255 }),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  ...timestamps,
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}));

export type CartItem = typeof cartItems.$inferSelect;
export type Cart = typeof carts.$inferSelect & {
  cart_items: CartItem[] | null;
};