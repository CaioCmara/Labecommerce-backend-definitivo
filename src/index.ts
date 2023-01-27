import { users, products, purchases } from "./database";

import { TUser, TProduct, TPurchase, PRODUCT_CATEGORY } from "./types";
import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";

// console.log(queryProductsByName("Fiat Mobi"));
// console.log(createPurchase("Pedro", "c001", 1, 70000));

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Porta 3003 rodando");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

//Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db("users");
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500);
    console.log(error);
    res.send(error.message);
  }
});

//Create user

app.post("/users", async (req: Request, res: Response) => {
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

    const idExistente = users.find((user) => user.id === id);
    if (idExistente) {
      res.status(400);
      throw new Error("Já existe um user com esse id");
    }
    const emailExistente = users.find((user) => user.email === email);
    if (emailExistente) {
      res.status(400);
      throw new Error("Já existe um user com esse email");
    }

    await db.raw(`
      INSERT INTO users(id, name, email, password) VALUES
      ("${id}", "${name}", "${email}", "${password}"); 
    `);

    res.status(201).send("Cadastro feito com sucesso");
  } catch (error: any) {
    console.error(error);
    res.send(error.message);
  }
});

//Buscar compras do cliente pelo ID

app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await db("purchases").where({ buyer_id: id });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error);
  }
});

// Get all products funcionalidade 1
app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db("products");
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500);
    console.log(error);
    res.send(error.message);
  }
});

//Get all purchases
app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const result = await db("purchases");
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500);
    console.log(error);
    res.send(error.message);
  }
});

// Get all products funcionalidade 2
app.get("/product/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (q === undefined) {
      res.status(400);
      throw new Error("Defina sua pesquisa");
    }
    if (q.length < 1) {
      res.status(404);
      throw new Error("Você deve adicionar pelo menos 1 caractere");
    }
    const getProduct = products.filter((product) =>
      product.name.toLowerCase().includes(q.toLowerCase())
    );
    res.status(200).send(getProduct);
  } catch (error: any) {
    res.status(500);
    console.log(error);
    res.send(error.message);
  }
});

//Create product
app.post("/products", async (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl, category } = req.body;

  try {
    if (!id) {
      return res.status(400).send("Adicione uma id ao produto");
    }
    if (typeof id !== "string") {
      return res.status(400).send("Seu ID deve ser uma string");
    }
    if (products.find((product) => product.id === id)) {
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
    if (
      category !== "Hatch" &&
      category !== "SUV" &&
      category !== "Sedã" &&
      category !== "Minivan" &&
      category !== "Esportivo"
    ) {
      return res.status(400).send("Produto deve ter uma categoria existente");
    }

    // Insert product into database
    await db.raw(`
      INSERT INTO products(id, name, price, description, imageUrl, category) VALUES 
      ("${id}", "${name}", "${price}", "${description}", "${imageUrl}", "${category}")
  `);

    res.status(200).send("Produto cadastrado com sucesso");
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error);
  }
});

// Produtos por id
app.get("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = products.find((product) => product.id === id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error);
  }
});

// deletar usuario por id
app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const indexToRemove = users.findIndex((user) => user.id === id);

    const findUser = users.find((user) => user.id === id);
    if (!findUser) {
      res.status(400);
      throw new Error("Usuario não encontrado");
    }

    if (indexToRemove >= 0) {
      users.splice(indexToRemove, 1);
    }
    res.status(200).send("Usuário deletado com sucesso");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// deletar  produto pelo id
app.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const indexToRemove = products.findIndex((product) => product.id === id);

    if (indexToRemove >= 0) {
      products.splice(indexToRemove, 1);
    } else {
      res.status(404);
      throw new Error("Produto não encontrado");
    }

    res.status(200).send("Produto deletado com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Edit product by id
app.put("/product/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id as String;
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;
    //  const description = req.body.description;
    // const image = req.body.image

    const product = products.find((product) => product.id === id);

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
      if (
        category !== "Hatch" &&
        category !== "SUV" &&
        category !== "Sedã" &&
        category !== "Minivan" &&
        category !== "Esportivo"
      ) {
        res.status(400);
        throw new Error("Categoria deve ser existente");
      }
    } /* if (description !== undefined){
          if (typeof price !== "string"){
              res.status(400);
              throw new Error ("A descrição deve ser uma string");
          }
      }
      if (image !== undefined){
        if (typeof price !== "string"){
            res.status(400);
            throw new Error ("A imagem deve ser uma URL em string");
        }
    } */
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.category = category || product.category;
    }
    res.status(200).send("Produto atualizado com sucesso!");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Create purchase

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, total_price, paid, created_at, quantity } = req.body;
    if (typeof id != "string") {
      res.status(400);
      throw new Error("Id deve ser umas string");
    }
    if (typeof created_at != "string") {
      res.status(400);
      throw new Error("Created_at deve ser uma string");
    }
    if (typeof buyer_id != "string") {
      res.status(400);
      throw new Error("Buyer_id deve ser uma string");
    }
    if (typeof total_price != "number" || total_price < 1) {
      res.status(400);
      throw new Error("Total_price deve ser um number e maior ou igual a 1");
    }

    if (typeof paid != "number" || (paid !== 0 && paid !== 1)) {
      res.status(400);
      throw new Error(
        "Paid deve ser um number igual a 1 para true e 0 para false"
      );
    }

    if (id.length < 1 || created_at.length < 1 || buyer_id.length < 1) {
      res.status(400);
      throw new Error("As informações devem ter no minimo 1 caractere");
    }

    const newPurchase: TPurchase = {
      id,
      total_price,
      paid,
      buyer_id,
      quantity,
    };

    await db("purchases").insert(newPurchase);

    res.status(201).send(`Compra cadastrada com sucesso`);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// Delete purchase by id

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
      
      const idToDelete = req.params.id;
 
      const [purchase] : TPurchase[] = await db("purchases").where({ id: idToDelete });
      if (!purchase){
          res.status(400);
          throw new Error ("Não foi encontrada uma compra com esse ID");
      }

  
      await db("purchases").del().where({ id: idToDelete });

      res.status(200).send({
          message: "Compra deletada com sucesso"
      })
  } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
          res.status(500);
      }

      if (error instanceof Error) {
          res.send(error.message);
      }  
  }
})

// Get purchase by id
app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
   
    const id = req.params.id;
    const purchase = await db("purchases")
      .select(
        'purchases.id AS purchaseId', 
        'purchases.buyer AS buyerId', 
        'users.name AS buyerName', 
        'users.email AS buyerEmail', 
        'purchases.total_price AS totalPrice', 
        'purchases.created_at AS createdAt', 
        'purchases.paid AS paid'
      )
      .innerJoin('users', 'purchases.buyer', 'users.id')
      .where({ id : id });
 
    const products = await db('purchases_products')
      .select(
        'products.id AS id', 
        'products.name AS name', 
        'products.price AS price', 
        'products.description AS description', 
        'products.image_url AS imageUrl', 
        'purchases_products.quantity AS quantity'
      )
      .innerJoin('products', 'purchases_products.product_id', 'products.id')
      .where({ id : id });

      if (!purchase) {
        res.status(404).send({ error: "Purchase not found" });
        return;
      }
      //spread operator pra combinar os objetos purchase e produtos
    const purchaseProducts = { ...purchase[0], products };
    res.status(200).send(purchaseProducts);
  } catch (error : any) {
    console.log(error );
    res.status(500).send(error.message);
  }
});



