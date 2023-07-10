import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Array,
    name: String,
    email: String,
    city: String,
    postal: String,
    address: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;
