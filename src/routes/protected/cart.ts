import express from "express";
import { addProductToCart, getCart } from "@/controller/cart";
import validateRequest from "@/utils/validate-request";

const cartRoutes = express.Router();

cartRoutes.get("/", getCart);

cartRoutes.post("/", addProductToCart);

export default cartRoutes;
