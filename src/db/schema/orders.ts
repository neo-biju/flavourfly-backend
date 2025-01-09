import {
  decimal,
  integer,
  pgTable,
  serial,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { addresses } from "./address";
import { timestamps } from "./etc";
import { relations } from "drizzle-orm";

export const orders = pgTable("orders", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => users.id),
  shippingAddressId: uuid("shipping_address_id").references(
    () => addresses.id
  ),
  billingAddressId: uuid("billing_address_id").references(
    () => addresses.id
  ),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  ...timestamps,
});

// Order items table (modified to store product details)
export const orderItems = pgTable("order_items", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  productId: varchar("product_id", { length: 255 }).notNull(), // ID from frontend
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: varchar("product_image", { length: 255 }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  ...timestamps,
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
