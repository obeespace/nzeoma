import { NextResponse } from "next/server";
import dbConnect from "../../util/dbConnect";
import Products from "../../models/products";

// GET - Fetch all menu items
export async function GET() {
  await dbConnect();
  const products = await Products.find({});
  return NextResponse.json(products);
}

// POST - Add a new menu item
export async function POST(req) {
  await dbConnect();
  const { name, description, price, image } = await req.json();
  const newProduct = new Products({ name, description, price, image });
  await newProduct.save();
  return NextResponse.json({ message: "Product added successfully", newProduct });
}

// DELETE - Remove a menu item
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();
  await Products.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted successfully" });
}

// PUT - Update a menu item
export async function PUT(req) {
  await dbConnect();
  const { id, name, description, price, image } = await req.json();
  const updatedProduct = await Products.findByIdAndUpdate(
    id,
    { name, description, price, image },
    { new: true }
  );
  return NextResponse.json({ message: "Product updated successfully", updatedProduct });
}
