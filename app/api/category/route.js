import { connectToDB } from "@lib/database";
import Category from "@models/category";

export const GET = async (req, res) => {
  try {
    await connectToDB();
    const categories = await Category.find({}).populate("parent");
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response("failed to fetch categories", { status: 500 });
  }
};
