-- Active: 1674668348502@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
    );

DROP TABLE users;

INSERT INTO
    users(
        id,
        name,
        email,
        password,
        createdAt
    )
VALUES (
        "u001",
        "Caio",
        "caio1801@gmail.com",
        "marleydog30",
        CURRENT_TIMESTAMP
    );

INSERT INTO
    users(
        id,
        name,
        email,
        password,
        createdAt
    )
VALUES (
        "u002",
        "Jessica",
        "JessicaBenzano@gmail.com",
        "thorfofo2012",
        CURRENT_TIMESTAMP
    );

INSERT INTO
    users(
        id,
        name,
        email,
        password,
        createdAt
    )
VALUES (
        "u003",
        "Elvis",
        "elvisC@hotmail.com",
        "caca301d",
        CURRENT_TIMESTAMP
    );

SELECT * FROM users;

-- criar tabela de produtos

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
    );

DROP TABLE products;

-- popular tabela com 5 produtos

INSERT INTO
    products(
        id,
        name,
        price,
        category,
        description,
        image
    )
VALUES (
        "c001",
        "Fiat Mobi",
        70000,
        "Hatch",
        "Um verdadeiro desbravador das ruas, o Fiat Mobi possui um desgin jovem pensado para encarar as ruas e avenidas com muita presença e estilo.",
        "#"
    ), (
        "c002",
        "Honda Civic 2023",
        220000,
        "Sedan",
        "O Honda Civic 2023 entra em um novo ano modelo cheio de atualizações, com o esportivo modelo Si unindo o desempenho estável da Honda com a versão mais recente do Type R de alto desempenho.",
        "#"
    ), (
        "c003",
        "Hyundai HB20",
        77790,
        "Hatch",
        "O Novo Hyundai HB20 tem personalidade arrojada e dinâmica, ao mesmo tempo que oferece ainda mais conforto e conveniência.",
        "#"
    ), (
        "c004",
        "Toyota Corolla Cross",
        159000,
        "SUV",
        "O carro mais vendido do mundo em sua versão SUV, com sintonia perfeita entre sistema híbrido, plataforma TNGA e muito espaço interno.",
        "#"
    ), (
        "c005",
        "Peugeot 208 ",
        85000,
        "Hatch",
        "O Peugeot 208 Griffe 2023 é a versão topo de linha do hatch e aposta em itens de tecnologia e segurança.",
        "#"
    );

SELECT * FROM products;

SELECT * FROM products WHERE name LIKE "Honda Civic 2023";

INSERT INTO users
VALUES (
        "u004",
        "Nine",
        "lilika@gmail.com",
        "port304",
        CURRENT_TIMESTAMP
    );

INSERT INTO products
VALUES (
        "c006",
        "Renault Duster",
        102290,
        "SUV",
        "O Duster é, sem dúvida, a melhor opção da categoria. E você não vê isso só do lado de fora. Por dentro está tudo incrível: painel, volante com comando satélite, ar-condicionado digital, bancos com Revestimento Premium e muito mais.",
        "#"
    );

SELECT * FROM products WHERE id = "c002";

DELETE FROM users WHERE id = "";

DELETE FROM products WHERE id = "";

-- edit user pelo id

UPDATE users
SET
    email = "rabicorte@gmail.com",
    password = "vastasrt"
WHERE id = "u004";

-- Edit Product by id

UPDATE products
SET
    name = "Honda Civic Novo",
    price = 200000
WHERE id = "c002";

-- orderna resultados pela ordem crescente dos emails

SELECT * FROM users ORDER BY email ASC;

SELECT * FROM products ORDER BY price ASC LIMIT 90000;

SELECT *
FROM products
WHERE
    price > 40000
    AND price < 180000
ORDER BY price ASC;

CREATE TABLE
    purchases(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        total_price REAL NOT NULL,
        paid INTEGER NOT NULL,
        --bolean
        created_at TEXT,
        buyer_id TEXT NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES users(id)
    );

DROP TABLE purchases;

--pedidos dos usuarios

INSERT INTO purchases
VALUES ("p001", 70000, 1, NULL, "u001"), ("p002", 200000, 0, NULL, "u001"), ("p003", 102290, 0, NULL, "u002"), ("p004", 70000, 1, NULL, "u002");

SELECT * FROM purchases;

-- status do pedido como entregue

UPDATE purchases
SET
    created_at = datetime('now')
WHERE id = "p003";

--SELECT * FROM purchases

--WHERE buyer_id = "Jessica"

SELECT
    users.id AS user_Id,
    users.email,
    purchases.created_at,
    purchases.total_price
FROM users
    INNER JOIN purchases ON purchases.buyer_id = users.id;

SELECT
    users.name,
    users.id AS user_Id,
    users.email,
    purchases.id as purchase_id,
    purchases.created_at,
    purchases.total_price,
    purchases.paid
FROM users
    INNER JOIN purchases ON purchases.buyer_id = users.id
WHERE users.id = "u001";

-- falta criar a de purchase-products

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );

SELECT * FROM purchases_products;

INSERT INTO
    purchases_products (
        purchase_id,
        product_id,
        quantity
    )
VALUES ("p001", "c001", 2), ("p002", "c002", 1), ("p003", "c003", 2), ("p004", "c004", 1);

SELECT
    purchases.buyer_id,
    purchases.id as purchase_id,
    products.name as product_name,
    purchases_products.quantity,
    purchases.total_price,
    purchases.paid,
    purchases.created_at as purchase_created_at
FROM purchases_products
    INNER JOIN purchases ON purchases_products.purchase_id = purchases.id
    INNER JOIN products ON purchases_products.product_id = products.id;