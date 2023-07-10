import { connectToDB } from "@lib/database";
import Order from "@models/order";

export const GET = async () => {
  try {
    await connectToDB();
    const orders = await Order.find({});
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(error, { status: 500 });
  }
};
