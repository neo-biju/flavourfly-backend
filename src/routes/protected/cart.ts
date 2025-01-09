import express from "express";
import {
  addProductToCart,
  deleteCartItemFromCart,
  getCart,
} from "@/controller/cart";
import validateRequest from "@/utils/validate-request";
import {
  cartItemDeleteFromCartValidation,
  cartItemsInsertValidation,
} from "@/validation";

const cartRoutes = express.Router();

cartRoutes.get("/", getCart);

cartRoutes.post(
  "/",
  validateRequest(cartItemsInsertValidation),
  addProductToCart
);

cartRoutes.delete(
  "/",
  validateRequest(cartItemDeleteFromCartValidation),
  deleteCartItemFromCart
);

export default cartRoutes;
