import { cache } from "react";
import { prisma } from "./db";

export const getProducts = cache(async () => {
  return prisma.product.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    take: 6,
  });
});

export const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
});

export const getCategories = cache(async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
});

export const getCart = cache(async (userId: string) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });
});

export const getOrders = cache(async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: true } },
      shipping: true,
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getOrder = cache(async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      shipping: true,
      user: true,
    },
  });
});

export const getAllOrders = cache(async () => {
  return prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getAllProducts = cache(async () => {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
});
