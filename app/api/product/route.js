import { connectToDB } from "@lib/database";
import Product from "@models/product";

export const GET = async (req, res) => {
  try {
    await connectToDB();

    const products = await Product.find({}).populate("category");

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch products", { status: 500 });
  }
};
