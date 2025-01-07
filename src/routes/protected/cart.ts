import express from "express";
import { addProductToCart, getCart } from "@/controller/cart";
import validateRequest from "@/utils/validate-request";
import { cartItemsInsertValidation } from "@/validation/cart";

const cartRoutes = express.Router();

cartRoutes.get("/", getCart);

cartRoutes.post(
  "/",
  validateRequest(cartItemsInsertValidation),
  addProductToCart
);

export default cartRoutes;
