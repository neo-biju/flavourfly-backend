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
    await cartService.addProductToCart(req.body);
    
    res.json({ message: "Product added to cart", status: 200 });
  } catch (error) {
    next(error);
  }
};
