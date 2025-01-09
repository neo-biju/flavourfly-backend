import express from "express";
import {
  addProductToCart,
  deleteCartItemFromCart,
  getCart,
  updateProductQty,
} from "@/controller/cart";
import validateRequest from "@/utils/validate-request";
import {
  cartItemDeleteFromCartValidation,
  cartItemsInsertValidation,
  updateProductQtyValidation,
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

cartRoutes.put(
  "/quantity",
  validateRequest(updateProductQtyValidation),
  updateProductQty
);

export default cartRoutes;
