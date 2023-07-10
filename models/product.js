import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    properties: {
      type: Array,
    },
    photos: {
      type: Array,
      required: [true, "no photos added"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
