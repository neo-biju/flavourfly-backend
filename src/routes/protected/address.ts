import {
  addAddress,
  deleteAddressById,
  getAddressById,
  getAllAddress,
  setDefaultAddress,
  updateAddress,
} from "@/controller/address";
import validateRequest from "@/utils/validate-request";
import {
  addressSchema,
  defaultAddressSchema,
  updateAddressSchema,
} from "@/validation/address";
import express from "express";

const addressRoute = express.Router();

addressRoute.post("/", validateRequest(addressSchema), addAddress);

addressRoute.put("", validateRequest(updateAddressSchema), updateAddress);

addressRoute.get("/", getAllAddress);

addressRoute.get("/:id", getAddressById);

addressRoute.delete("/:id", deleteAddressById);

addressRoute.post(
  "/default",
  validateRequest(defaultAddressSchema),
  setDefaultAddress
);

export default addressRoute;
