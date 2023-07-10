import { connectToDB } from "@lib/database";
import Product from "@models/product";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const product = await Product.findById(params.id).populate("category");
    if (!product)
      return new Response("could not find product", { status: 404 });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response("failed to fetch product data", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    const { title, category, properties, photos, description, price } =
      await req.json();
    await connectToDB();

    const product = await Product.findById(params.id).populate("category");
    if (!product)
      return new Response("could not find product", { status: 404 });

    product.title = title;
    product.category = category;
    product.properties = properties;
    product.photos = photos;
    product.description = description;
    product.price = price;

    product.save();

    return new Response("successfully updated product", { status: 200 });
  } catch (error) {
    return new Response("failed to edit product", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    await Product.findByIdAndRemove(params.id);

    return new Response("Product successfully deleted", { status: 200 });
  } catch (error) {
    return new Response("failed delete product", { status: 500 });
  }
};
