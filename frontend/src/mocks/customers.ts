import type { Customer } from "../types/customer";
export const customers: Customer[] = [
    {
        id:"CUS-001",
        type:"Pessoa Jurídica",
        name:"Empresa Alpha",
        document:"12.345.678/0001-99",
        email:"contato@alpha.com",
        phone: "(11) 99999-9999",
        address: {
            street: "Rua A",
            number: "100",
            neighborhood: "Centro",
            city: "Vitória",
            state: "ES          ",
            zipCode: "01000-000"
        }
    },

    {
        id:"CUS-002",
        type:"Pessoa Jurídica",
        name:"Empresa Beta",
        document:"98.765.432/0001-00",
        email:"contato@beta.com",
        phone:"(31) 98888-8888",
        address:{
            street: "Rua A",
            number: "100",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            zipCode: "01000-000"
        }
    }
];