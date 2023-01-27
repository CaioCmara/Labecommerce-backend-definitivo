"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./database/knex");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Porta 3003 rodando");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("users");
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500);
        console.log(error);
        res.send(error.message);
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, password } = req.body;
        if (!id) {
            res.status(400);
            throw new Error("User precisa ter um id");
        }
        if (typeof id !== "string") {
            res.status(404);
            throw new Error("`ID` deve ser uma string");
        }
        if (!name) {
            res.status(400);
            throw new Error("User precisa ter um name");
        }
        if (typeof name !== "string") {
            res.status(404);
            throw new Error("`name` deve ser uma string");
        }
        if (!email) {
            res.status(400);
            throw new Error("User precisa ter um email");
        }
        if (typeof email !== "string") {
            res.status(404);
            throw new Error("`email` deve ser uma string");
        }
        const idExistente = database_1.users.find((user) => user.id === id);
        if (idExistente) {
            res.status(400);
            throw new Error("Já existe um user com esse id");
        }
        const emailExistente = database_1.users.find((user) => user.email === email);
        if (emailExistente) {
            res.status(400);
            throw new Error("Já existe um user com esse email");
        }
        yield knex_1.db.raw(`
      INSERT INTO users(id, name, email, password) VALUES
      ("${id}", "${name}", "${email}", "${password}"); 
    `);
        res.status(201).send("Cadastro feito com sucesso");
    }
    catch (error) {
        console.error(error);
        res.send(error.message);
    }
}));
app.get("/users/:id/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield (0, knex_1.db)("purchases").where({ buyer_id: id });
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error);
    }
}));
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("products");
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500);
        console.log(error);
        res.send(error.message);
    }
}));
app.get("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("purchases");
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500);
        console.log(error);
        res.send(error.message);
    }
}));
app.get("/product/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = req.query.q;
        if (q === undefined) {
            res.status(400);
            throw new Error("Defina sua pesquisa");
        }
        if (q.length < 1) {
            res.status(404);
            throw new Error("Você deve adicionar pelo menos 1 caractere");
        }
        const getProduct = database_1.products.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));
        res.status(200).send(getProduct);
    }
    catch (error) {
        res.status(500);
        console.log(error);
        res.send(error.message);
    }
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price, description, imageUrl, category } = req.body;
    try {
        if (!id) {
            return res.status(400).send("Adicione uma id ao produto");
        }
        if (typeof id !== "string") {
            return res.status(400).send("Seu ID deve ser uma string");
        }
        if (database_1.products.find((product) => product.id === id)) {
            return res.status(400).send("Essa ID já existe");
        }
        if (!name) {
            return res.status(400).send("Adicione um nome ao produto");
        }
        if (typeof name !== "string") {
            return res.status(400).send("Nome deve ser uma string");
        }
        if (!price) {
            return res.status(400).send("Adicione um valor ao preço");
        }
        if (typeof price !== "number") {
            return res.status(400).send("O preço do produto deve ser um número");
        }
        if (!description) {
            return res.status(400).send("Adiciona uma descrição ao produto");
        }
        if (typeof description !== "string") {
            return res.status(400).send("A descrição do produto deve ser uma string");
        }
        if (!imageUrl) {
            return res.status(400).send("O produto deve ter uma URL");
        }
        if (typeof imageUrl !== "string") {
            return res.status(400).send("A imagem deve ter uma URL em string");
        }
        if (!category) {
            return res.status(400).send("Produto deve ter uma categoria existente");
        }
        if (category !== "Hatch" &&
            category !== "SUV" &&
            category !== "Sedã" &&
            category !== "Minivan" &&
            category !== "Esportivo") {
            return res.status(400).send("Produto deve ter uma categoria existente");
        }
        yield knex_1.db.raw(`
      INSERT INTO products(id, name, price, description, imageUrl, category) VALUES 
      ("${id}", "${name}", "${price}", "${description}", "${imageUrl}", "${category}")
  `);
        res.status(200).send("Produto cadastrado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error);
    }
}));
app.get("/products/:id", (req, res) => {
    try {
        const id = req.params.id;
        const result = database_1.products.find((product) => product.id === id);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error);
    }
});
app.delete("/users/:id", (req, res) => {
    try {
        const id = req.params.id;
        const indexToRemove = database_1.users.findIndex((user) => user.id === id);
        const findUser = database_1.users.find((user) => user.id === id);
        if (!findUser) {
            res.status(400);
            throw new Error("Usuario não encontrado");
        }
        if (indexToRemove >= 0) {
            database_1.users.splice(indexToRemove, 1);
        }
        res.status(200).send("Usuário deletado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.delete("/products/:id", (req, res) => {
    try {
        const id = req.params.id;
        const indexToRemove = database_1.products.findIndex((product) => product.id === id);
        if (indexToRemove >= 0) {
            database_1.products.splice(indexToRemove, 1);
        }
        else {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        res.status(200).send("Produto deletado com sucesso");
    }
    catch (error) {
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.put("/user/:id", (req, res) => {
    try {
        const idToEdit = req.params.id;
        const id = req.body.id;
        const email = req.body.email;
        const password = req.body.password;
        const user = database_1.users.find((user) => user.id === idToEdit);
        console.log(user);
        if (!user) {
            res.status(404);
            throw new Error("Usuário não encontrado");
        }
        if (email !== undefined) {
            if (typeof email !== "string") {
                res.status(400);
                throw new Error("Email deve ser uma string");
            }
        }
        if (password !== undefined) {
            if (typeof password !== "string") {
                res.status(400);
                throw new Error("Senha deve ser uma string");
            }
        }
        if (user) {
            user.id = id || user.id;
            user.email = email || user.email;
            user.password = password || user.password;
        }
        res.status(200).send("Cadastro atualizado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.put("/product/:id", (req, res) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const price = req.body.price;
        const category = req.body.category;
        const product = database_1.products.find((product) => product.id === id);
        if (!product) {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        if (name !== undefined) {
            if (typeof name !== "string") {
                res.status(400);
                throw new Error("Produto deve ser uma string");
            }
        }
        if (price !== undefined) {
            if (typeof price !== "number") {
                res.status(400);
                throw new Error("Preço do produto deve ser um número");
            }
        }
        if (category !== undefined) {
            if (category !== "Hatch" &&
                category !== "SUV" &&
                category !== "Sedã" &&
                category !== "Minivan" &&
                category !== "Esportivo") {
                res.status(400);
                throw new Error("Categoria deve ser existente");
            }
        }
        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.category = category || product.category;
        }
        res.status(200).send("Produto atualizado com sucesso!");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
//# sourceMappingURL=index.js.map