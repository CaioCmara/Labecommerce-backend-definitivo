"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchases = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
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
exports.products = [
    {
        id: "c001",
        name: "Fiat Mobi",
        price: 70000,
        category: types_1.PRODUCT_CATEGORY.HATCH,
    },
    {
        id: "c002",
        name: "Honda Civic 2023",
        price: 220000,
        category: types_1.PRODUCT_CATEGORY.SEDAN,
    },
];
exports.purchases = [
    {
        userId: "caio",
        productId: "c001",
        quantity: 1,
        totalPrice: 70000,
    },
    {
        userId: "jessica",
        productId: "c002",
        quantity: 2,
        totalPrice: 440000,
    },
];
function createUser(id, email, password) {
    exports.users.push({
        id,
        email,
        password,
    });
    return "Cadastro realizado com sucesso";
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, category) {
    exports.products.push({
        id,
        name,
        price,
        category,
    });
    return "Produto criado com sucesso";
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(id) {
    return exports.products.find((product) => product.id === id);
}
exports.getProductById = getProductById;
function queryProductsByName(q) {
    return exports.products.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));
}
exports.queryProductsByName = queryProductsByName;
function createPurchase(userId, productId, quantity, totalPrice) {
    exports.purchases.push({
        userId,
        productId,
        quantity,
        totalPrice,
    });
    return "Compra realizada com sucesso";
}
exports.createPurchase = createPurchase;
function getAllPurchasesFromUserId(userIdToSearch) {
    return exports.purchases.filter((purchase) => purchase.userId === userIdToSearch);
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=database.js.map