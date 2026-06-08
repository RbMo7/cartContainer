"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { auth } from "./auth";
import { stripe } from "./stripe";

// ─── Cart ───────────────────────────────────────────────

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const cart =
    (await prisma.cart.findUnique({ where: { userId: session.user.id } })) ??
    (await prisma.cart.create({ data: { userId: session.user.id } }));

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  revalidatePath("/cart");
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }
  revalidatePath("/cart");
}

export async function removeFromCart(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
}

// ─── Checkout ────────────────────────────────────────────

export async function createCheckoutSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  // Create order in pending state
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      status: "pending",
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    },
  });

  // Create Stripe checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: cart.items.map((i) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: i.product.name,
          images: i.product.image ? [i.product.image] : [],
        },
        unit_amount: i.product.price,
      },
      quantity: i.quantity,
    })),
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart?cancelled=1`,
  });

  // Update order with Stripe session
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeId: stripeSession.id },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  revalidatePath("/cart");
  return { url: stripeSession.url };
}

// ─── Products ────────────────────────────────────────────

export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  categoryId: string;
  featured?: boolean;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.product.create({
    data: {
      ...data,
      price: Math.round(data.price * 100), // convert to cents
      published: true,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    published: boolean;
    featured: boolean;
  }>,
) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.product.update({
    where: { id },
    data: data.price
      ? { ...data, price: Math.round(data.price * 100) }
      : data,
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin/orders");
}

// ─── Seed ────────────────────────────────────────────────

export async function seedProducts() {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const existing = await prisma.product.count();
  if (existing > 0) return;

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Electronics", slug: "electronics" } }),
    prisma.category.create({ data: { name: "Clothing", slug: "clothing" } }),
    prisma.category.create({ data: { name: "Home & Garden", slug: "home-garden" } }),
    prisma.category.create({ data: { name: "Sports", slug: "sports" } }),
  ]);

  const products = await prisma.product.createMany({
    data: [
      { name: "Wireless Headphones", slug: "wireless-headphones", description: "Premium noise-cancelling wireless headphones with 30h battery life.", price: 14999, stock: 50, categoryId: categories[0]!.id, featured: true, image: "https://picsum.photos/seed/headphones/400/400" },
      { name: "Bluetooth Speaker", slug: "bluetooth-speaker", description: "Portable waterproof speaker with deep bass and 12h playback.", price: 7999, stock: 100, categoryId: categories[0]!.id, featured: true, image: "https://picsum.photos/seed/speaker/400/400" },
      { name: "USB-C Hub", slug: "usb-c-hub", description: "7-in-1 USB-C hub with HDMI, SD card, and 100W PD charging.", price: 4999, stock: 200, categoryId: categories[0]!.id, image: "https://picsum.photos/seed/usbhub/400/400" },
      { name: "Cotton T-Shirt", slug: "cotton-tshirt", description: "Essential crew neck tee in premium organic cotton.", price: 2999, stock: 150, categoryId: categories[1]!.id, featured: true, image: "https://picsum.photos/seed/tshirt/400/400" },
      { name: "Denim Jacket", slug: "denim-jacket", description: "Classic denim jacket with a modern slim fit.", price: 8999, stock: 40, categoryId: categories[1]!.id, image: "https://picsum.photos/seed/jacket/400/400" },
      { name: "Running Shoes", slug: "running-shoes", description: "Lightweight responsive cushioning for everyday runs.", price: 12999, stock: 60, categoryId: categories[3]!.id, featured: true, image: "https://picsum.photos/seed/shoes/400/400" },
      { name: "Yoga Mat", slug: "yoga-mat", description: "Non-slip extra thick mat for yoga and pilates.", price: 3999, stock: 80, categoryId: categories[3]!.id, image: "https://picsum.photos/seed/yogamat/400/400" },
      { name: "Potted Plant Pot", slug: "potted-plant-pot", description: "Ceramic planter with drainage hole, modern matte finish.", price: 2499, stock: 120, categoryId: categories[2]!.id, image: "https://picsum.photos/seed/planter/400/400" },
      { name: "LED Desk Lamp", slug: "led-desk-lamp", description: "Adjustable touch lamp with 3 color temps and USB charging.", price: 4999, stock: 90, categoryId: categories[2]!.id, image: "https://picsum.photos/seed/lamp/400/400" },
      { name: "Backpack", slug: "backpack", description: "Waterproof 25L backpack with laptop sleeve and padded straps.", price: 6999, stock: 70, categoryId: categories[1]!.id, image: "https://picsum.photos/seed/backpack/400/400" },
    ],
  });

  revalidatePath("/products");
}
