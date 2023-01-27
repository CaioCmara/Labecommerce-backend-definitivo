import { TUser, TProduct, TPurchase, PRODUCT_CATEGORY } from "./types";

export const users: TUser[] = [
  {
    id: "u001",

    email: "caio1801@gmail.com",
    password: "marleydog30",
  },
  {
    id: "u002",

    email: "JessicaBenzano@gmail.com",
    password: "thorfofo2012",
  },
];

export const products: TProduct[] = [
  {
    id: "c001",
    name: "Fiat Mobi",
    price: 70000,
    category: PRODUCT_CATEGORY.HATCH,
  },
  {
    id: "c002",
    name: "Honda Civic 2023",
    price: 220000,
    category: PRODUCT_CATEGORY.SEDAN,
  },
];

export const purchases: TPurchase[] = [
  {
    id: "p001",
    buyer_id: "u001",
    quantity: 1,
    paid: 1,
    total_price: 70000
  },
  {
    id: "p002",
    buyer_id: "u002",
    quantity: 0,
    paid: 1,
    total_price: 440000,
  },
];

export function createUser(
  id: string,

  email: string,
  password: string
): string {
  users.push({
    id,
    email,
    password,
  });
  return "Cadastro realizado com sucesso";
}

export function getAllUsers(): TUser[] {
  return users;
}

export function createProduct(
  id: string,
  name: string,
  price: number,
  category: PRODUCT_CATEGORY
): string {
  products.push({
    id,
    name,
    price,
    category,
  });
  return "Produto criado com sucesso";
}

export function getAllProducts(): TProduct[] {
  return products;
}

export function getProductById(id: string): undefined | TProduct {
  return products.find((product) => product.id === id);
}

export function queryProductsByName(q: string): TProduct[] {
  return products.filter((product) =>
    product.name.toLowerCase().includes(q.toLowerCase())
  );
}

export function createPurchase(
  id: string,
  buyer_id: string,
  paid: number,
  quantity: number,
  total_price: number
): string {
  purchases.push({
    id,
    buyer_id,
    quantity,
    paid,
    total_price,
  });
  return "Compra realizada com sucesso";
}

export function getAllPurchasesFromUserId(userIdToSearch: string): TPurchase[] {
  return purchases.filter((purchase) => purchase.id === userIdToSearch);
}
