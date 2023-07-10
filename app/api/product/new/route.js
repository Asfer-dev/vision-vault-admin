import { connectToDB } from "@lib/database";
import Product from "@models/product";

export const POST = async (req, res) => {
  try {
    const { title, category, properties, photos, description, price } =
      await req.json();

    await connectToDB();

    const newProduct = new Product({
      title,
      category,
      properties,
      photos,
      description,
      price,
    });

    newProduct.save();

    return new Response("Successfully created new product", { status: 200 });
  } catch (error) {
    return new Response("Failed to create new product", { status: 500 });
  }
};
