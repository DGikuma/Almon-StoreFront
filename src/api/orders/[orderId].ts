import { NextApiRequest, NextApiResponse } from "next";
// import db from "@/lib/db"; // your database connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  try {
    const order = await db.order.findUnique({ where: { id: orderId as string } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
