import { connectToDB } from "@lib/database";
import Category from "@models/category";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const category = await Category.findById(params.id).populate("parent");
    if (!category)
      return new Response("could not find category", { status: 404 });

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response("failed to fetch category data", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    const { name, parent, properties } = await req.json();
    await connectToDB();

    const category = await Category.findById(params.id).populate("parent");
    if (!category)
      return new Response("could not find category", { status: 404 });

    category.name = name;
    category.parent = parent;
    category.properties = properties;

    category.save();

    return new Response("successfully updated category", { status: 200 });
  } catch (error) {
    return new Response("failed to update category", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    await Category.findByIdAndRemove(params.id);

    return new Response("Category successfully deleted", { status: 200 });
  } catch (error) {
    return new Response("failed delete category", { status: 500 });
  }
};
