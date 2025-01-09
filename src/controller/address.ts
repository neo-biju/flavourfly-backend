import AddressService from "@/services/address-service";
import { NextFunction, Request, Response } from "express";

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressService = new AddressService();
  try {
    const response = await addressService.createAddress(req.body);
    res.success("Address added successfully", response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressService = new AddressService();
  try {
    const response = await addressService.getAllAddress(req.body.userId);
    res.success("success", response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressService = new AddressService();
  const id = req.params.id;
  try {
    const response = await addressService.getAddressById(id);
    res.success("success", response);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressService = new AddressService();
  const id = req.params.id;
  try {
    const response = await addressService.removeAddressById(id);
    res.success("success", response);
    return;
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressService = new AddressService();

  try {
    const response = await addressService.setDefaultAddress(
      req.body.addressId,
      req.body.userId
    );
    res.success("success", response);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addressService = new AddressService();
  try {
    const response = await addressService.updateAddress(req.body);
    res.success("success", response);
    return;
  } catch (error) {
    next(error);
  }
};
