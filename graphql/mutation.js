import { execOnce } from "next/dist/shared/lib/utils";
import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        active
        lastLogin
        createdAt
        updatedAt
      }
    }
  }
`;

// =========================PRODUCT============================================================
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const CREATE_PRODUCT_FOR_SHOP = gql`
  mutation CreateProductForShop($input: ProductForShopInput!) {
    createProductForShop(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductId: ID!, $input: ProductUpdateInput!) {
    updateProduct(id: $updateProductId, input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const UPDATE_PRODUCT_FOR_SHOP = gql`
  mutation UpdateProductForShop($productId: ID!, $input: ProductForShopInput) {
    updateProductForShop(productId: $productId, input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
export const DELETE_PRODUCT_FOR_SHOP = gql`
  mutation DeleteProductForShop($productId: ID!) {
    deleteProductForShop(productId: $productId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
// ===============================END PRODUCT MUTATION============================================================

// ===============================START CATEGORY MUTATION==================================================================
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput) {
    createCategory(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($updateCategoryId: ID!, $input: CategoryInput) {
    updateCategory(id: $updateCategoryId, input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($deleteCategoryId: ID!) {
    deleteCategory(id: $deleteCategoryId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
// ===============================END CATEGORY MUTATION==================================================================

// ================================START STORE MUTATION==================================================================
export const CREATE_STORE = gql`
  mutation CreateStore($input: StoreInput!) {
    createStore(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $input: StoreUpdateInput!) {
    updateStore(id: $id, input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const DELETE_STORE = gql`
  mutation DeleteStore($id: ID!) {
    deleteStore(id: $id)
  }
`;

// ================================END STORE MUTATION==================================================================

export const ADJUST_STOCK = gql`
  mutation AdjustStock($productId: ID!, $quantity: Int!, $reason: String!) {
    adjustStock(productId: $productId, quantity: $quantity, reason: $reason) {
      id
      name
      stock
      lowStock
    }
  }
`;

export const CREATE_SALE = gql`
  mutation CreateSale($input: SaleInput!) {
    createSale(input: $input) {
      id
      saleNumber
      cashier {
        id
        name
      }
      items {
        product {
          id
          name
        }
        name
        price
        quantity
        total
      }
      subtotal
      tax
      discount
      total
      paymentMethod
      amountPaid
      change
      status
      createdAt
    }
  }
`;
//=========================================START SUPPLIER MUTATION====================================================
export const CREATE_SUPPLIER = gql`
  mutation CreateSupplier($input: SupplierInput!) {
    createSupplier(input: $input) {
      id
      name
      contactPerson
      email
      phone
      address
      active
      createdAt
      updatedAt
    }
  }
`;
export const CREATE_SUPPLIER_FOR_SHOP = gql`
mutation CreateSupplierForShop($input: SupplierInput, $shopId: ID) {
  createSupplierForShop(input: $input, shopId: $shopId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_SUPPLIER = gql`
  mutation UpdateSupplier($id: ID!, $input: SupplierUpdateInput!) {
    updateSupplier(id: $id, input: $input) {
      id
      name
      contactPerson
      email
      phone
      address
      active
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_SUPPLIER_FOR_SHOP = gql`
mutation UpdateSupplierForShop($input: SupplierUpdateInput, $supplierId: ID, $shopId: ID) {
  updateSupplierForShop(input: $input, supplierId: $supplierId, shopId: $shopId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_SUPPLIER_FOR_SHOP = gql`
mutation DeleteSupplierForShop($deleteSupplierForShopId: ID) {
  deleteSupplierForShop(id: $deleteSupplierForShopId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

//=========================================END SUPPLIER MUTATION====================================================


// =======================================START PURCHASE MUTATION===================================================
export const CREATE_PURCHASE_ORDER = gql`
  mutation CreatePurchaseOrder($input: PurchaseOrderInput!) {
    createPurchaseOrder(input: $input) {
      id
      poNumber
      supplier {
        id
        name
      }
      items {
        product {
          id
          name
        }
        name
        quantity
        unitCost
        total
      }
      subtotal
      tax
      total
      status
      orderedBy {
        id
        name
      }
      orderDate
      receivedDate
      notes
      createdAt
      updatedAt
    }
  }
`;


export const CREATE_PURCHASE_ORDER_FOR_SHOP =gql`
mutation CreateProductForShop($input: ProductForShopInput!) {
  createProductForShop(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

// =======================================START PURCHASE MUTATION===================================================

export const RECEIVE_PURCHASE_ORDER = gql`
  mutation ReceivePurchaseOrder($id: ID!) {
    receivePurchaseOrder(id: $id) {
      id
      poNumber
      status
      receivedDate
    }
  }
`;
//=====================================START USER MUTATION ============================================================
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
      active
      createdAt
      updatedAt
    }
  }
`;
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
//=====================================END USER MUTATION ============================================================

export const CREATE_BANNER = gql`
  mutation CreateBanner($input: BannerInput) {
    createBanner(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
export const UPDATE_BANNER = gql`
  mutation UpdateBanner($updateBannerId: ID!, $input: BannerInput) {
    updateBanner(id: $updateBannerId, input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
export const DELETE_BANNER = gql`
  mutation DeleteBanner($deleteBannerId: ID!) {
    deleteBanner(id: $deleteBannerId) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;



export const UPDATE_PURCHASE_ORDER_STATUS = gql`
  mutation UpdatePurchaseOrderStatus(
    $updatePurchaseOrderStatusId: ID!
    $status: POStatus!
  ) {
    updatePurchaseOrderStatus(
      id: $updatePurchaseOrderStatusId
      status: $status
    ) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;
// ======================================SHOP MUTATION===========================
export const CREATE_SHOP = gql`
mutation CreateShopForSeller($input: ShopInput) {
  createShopForSeller(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_ORDER_BY_CUSTOMER=gql`
mutation CreateCustomerOrderProduct($input: OrderInput) {
  createCustomerOrderProduct(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`