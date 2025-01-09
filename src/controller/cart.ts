import { CartService } from "@/services/cart-service";
import { NextFunction, Request, Response } from "express";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cartService = new CartService();

  try {
    const cart = await cartService.getOrCreateCart(req.body.userId);
    res.json({ message: "success", cart, status: 200 });
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartService = new CartService();
    const userCart = await cartService.getOrCreateCart(req.body.userId);

    req.body.cartId = userCart.id;
    const response = await cartService.addProductToCart(
      req.body,
      req.body.userId
    );
    res.success("Product added to cart", response);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async () => {};

export const deleteCartItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cartService = new CartService();
  try {
    const userCart = await cartService.getOrCreateCart(req.body.userId);

    const findTheProductCart = userCart.cart_items?.find(
      (item) => item?.productId === req.body.productId
    );

    if (findTheProductCart) {
      await cartService.deleteProductFromCart(req.body.productId);
      res.success("Product deleted from cart");
      return;
    }

    res.error("Product not found in cart", 404);
  } catch (error) {
    next(error);
  }
};

export const updateProductQty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.success("Product quantity updated");
    return;
  } catch (error) {
    console.log(error);
  }
};
