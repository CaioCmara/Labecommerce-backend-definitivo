
export type TUser ={
    
    id: string
  
    email: string
    password: string
}

export type TProduct ={
    id: string
    name: string
    price: number
    category: PRODUCT_CATEGORY
}

export type TPurchase ={
    id: string
    buyer_id: string
    paid:number
    total_price: number
    quantity: number
}

export enum PRODUCT_CATEGORY {
    HATCH = "Hatch",
    SUV = "SUV",
    SEDAN = "Sedã",
    MINIVAN = "Minivan",
    SPORTS = "Esportivo"
}

 