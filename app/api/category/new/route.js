import { connectToDB } from "@lib/database";
import Category from "@models/category";

export const POST = async (req, res) => {
  try {
    const { name, parent, properties } = await req.json();

    await connectToDB();

    const newCategory = new Category({
      name,
      parent,
      properties,
    });

    newCategory.save();

    return new Response("successfully created new category", { status: 200 });
  } catch (error) {
    return new Response("failed to create new category", { status: 500 });
  }
};
