import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
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
`;

// =============================START PRODUCT QUERY==============================

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      category
      price
      cost
      sku
      stock
      minStock
      isCombo
      comboItems {
        product {
          id
          name
          price
        }
        quantity
      }
      subImage {
        id
        url
        altText
        caption
      }
      discount {
        id
        defaultPrice
        description
        discountPrice
      }
      image
      active
      lowStock
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_OWNER = gql`
  query ProductsByOwner($owner: ID!) {
    productsByOwner(owner: $owner) {
      id
      name
      active
      addSlide {
        id
        title
        header
        description
        image
      }
      category
      comboItems {
        product {
          id
        }
        quantity
      }
      cost
      createdAt
      description
      discount {
        id
        defaultPrice
        description
        discountPrice
      }
      image
      isCombo
      lowStock
      minStock
      price
      sku
      stock
      subImage {
        id
        url
        altText
        caption
      }
      owner {
        id
        name
      }
      shops {
        shop
        isVisible
        customPrice
        createdAt
      }
      updatedAt
    }
  }
`;
export const GET_PROUCT_BY_CATEGORY = gql`
  query ProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      id
      name
      description
      category
      price
      cost
      sku
      stock
      minStock
      isCombo
      comboItems {
        quantity
      }
      discount {
        id
        defaultPrice
        description
        discountPrice
      }
      image
      active
      lowStock
      createdAt
      updatedAt
    }
  }
`;
export const GET_PRODUCT_BY_SHOP_CATEGORY_ID = gql`
  query GetProductByShopCategoryId($shopCategoryId: String) {
    getProductByShopCategoryId(shopCategoryId: $shopCategoryId) {
      id
      name
      updatedAt
      subImage {
        id
        url
        altText
        caption
      }
      stock
      sku
      price
      minStock
      mainStock {
        quantity
        minStock
        lowStock
      }
      image
      lowStock
      isCombo
      discount {
        id
        defaultPrice
        description
        discountPrice
      }
      active
      addSlide {
        id
        title
        header
        description
        image
      }
      category
      comboItems {
        quantity
      }
      shopCategory {
        id
        name
      }
      description
      cost
      createdAt
    }
  }
`;
export const GET_PRODUCT_FOR_SHOP = gql`
  query GetProductsForShop($shopId: ID!) {
    getProductsForShop(shopId: $shopId) {
      id
      active
      addSlide {
        id
        title
        header
        description
        image
      }
      category
      comboItems {
        quantity
      }
      cost
      description
      discount {
        id
        defaultPrice
        description
        discountPrice
      }
      image
      isCombo
      lowStock
      mainStock {
        quantity
        minStock
        lowStock
      }
      shopCategory {
        id
        name
      }
      minStock
      name
      price
      sku
      stock
      subImage {
        id
        url
        altText
        caption
      }
    }
  }
`;
export const GET_PRODUCT_FOR_SHOP_WITH_PAGNATION = gql`
  query GetProductForShopWithPagination(
    $page: Int
    $limit: Int
    $pagination: Boolean
    $keyword: String
    $shopId: ID
  ) {
    getProductForShopWithPagination(
      page: $page
      limit: $limit
      pagination: $pagination
      keyword: $keyword
      shopId: $shopId
    ) {
      data {
        id
        active
        addSlide {
          id
          title
          header
          description
          image
        }
        category
        comboItems {
          quantity
        }
        cost
        description
        discount {
          id
          defaultPrice
          description
          discountPrice
        }
        image
        isCombo
        lowStock
        mainStock {
          quantity
          minStock
          lowStock
        }

        minStock
        name
        price
        sku
        stock
        subImage {
          id
          url
          altText
          caption
        }
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;
// ================================END PRODUCT QUERY===================================

export const GET_BANNERS = gql`
  query Banners {
    banners {
      id
      category
      image
      title
      subtitle
      link
      active
    }
  }
`;
export const GET_BANNER_BY_CATEGORY = gql`
  query BannerByCategory($category: String) {
    bannerByCategory(category: $category) {
      id
      category
      image
      title
      subtitle
      link
      active
    }
  }
`;

// export const GET_PRODUCT = gql`
//   query GetProduct($id: ID!) {
//     product(id: $id) {
//       id
//       name
//       description
//       category
//       price
//       cost
//       sku
//       stock
//       minStock
//       isCombo
//       comboItems {
//         product {
//           id
//           name
//           price
//         }
//         quantity
//       }
//       image
//       active
//       lowStock
//       createdAt
//       updatedAt
//     }
//   }
// `;

export const GET_PRODUCT = gql`
  query Product($productId: ID!) {
    product(id: $productId) {
      id
      name
      description
      category
      price
      cost
      sku
      stock
      minStock
      isCombo
      comboItems {
        quantity
      }
      subImage {
        url
        altText
        caption
      }
      image
      active
      lowStock
      createdAt
      updatedAt
    }
  }
`;
// ==================================START CATEGORY QUERY================================
export const GET_CATEGORYS = gql`
  query Categorys {
    categorys {
      id
      name
      slug
      description
      image
      active
      createdAt
      updatedAt
    }
  }
`;
export const GET_CATEGORY_FOR_SHOP = gql`
  query GetCategoriesForShop($shopId: ID!) {
    getCategoriesForShop(shopId: $shopId) {
      id
      name
      updatedAt
      slug
      image
      description
      createdAt
      active
      parent {
        id
        name
      }
    }
  }
`;
export const GET_ADMIN_CATEGORY = gql`
  query GetParentCategoryForAdmin {
    getParentCategoryForAdmin {
      id
      name
      slug
      description
      image
      active
      createdAt
      updatedAt
    }
  }
`;
export const GET_CATEGORY = gql`
  query Category($categoryId: ID!) {
    category(id: $categoryId) {
      name
      id
    }
  }
`;
// ==================================END CATEGORY QUERY================================
export const GET_ALL_SHOPS = gql`
  query GetShops {
    getShops {
      id
      code
      slug
      image
      shopName
      description
      createdAt
      updatedAt
      enName
    }
  }
`;
export const GET_MY_SHOPS = gql`
  query GetShopsByOwnerId($getShopsByOwnerIdId: ID!) {
    getShopsByOwnerId(id: $getShopsByOwnerIdId) {
      id
      owner {
        id
        name
        email
        role
        active
        lastLogin
        createdAt
        updatedAt
      }
      shopName
      description
      createdAt
      updatedAt
    }
  }
`;
export const GET_SHOP_BY_SHOP_ID = gql`
  query Shop($shopId: ID!) {
    shop(id: $shopId) {
      id
      code
      slug
      image
      shopName
      enName
      type {
        name
      }
      description
      createdAt
      updatedAt
    }
  }
`;
export const GET_SHOP_BY_TYPE_ID = gql`
  query GetShopsByTypeId($typeId: ID) {
    getShopsByTypeId(typeId: $typeId) {
      id
      code
      slug
      image
      shopName
      enName
      description
      createdAt
      updatedAt
    }
  }
`;
// ================================START LOW STOCK PRODUCT===================================
export const GET_LOW_STOCK_PRODUCTS = gql`
  query GetLowStockProducts {
    lowStockProducts {
      id
      name
      category
      stock
      minStock
      lowStock
    }
  }
`;

export const GET_LOW_STOCK_PRODUCTS_FOR_SHOP = gql`
  query GetLowStockProductByShop($shopId: ID) {
    getLowStockProductByShop(shopId: $shopId) {
      id
      name
      category
      stock
      minStock
      lowStock
    }
  }
`;
// ===============================END LOW STOCK PRODUCT======================================
export const GET_SALES = gql`
  query GetSales($limit: Int, $offset: Int) {
    sales(limit: $limit, offset: $offset) {
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
// ===============================START SUPPLERY QUERY=================================
export const GET_SUPPLIERS = gql`
  query GetSuppliers {
    suppliers {
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
export const GET_SUPPLIERS_FOR_SHOP = gql`
  query GetSuppliersForShop($shopId: ID) {
    getSuppliersForShop(shopId: $shopId) {
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
// ===============================END SUPPLIER QUERY================================

export const GET_PURCHASE_ORDERS = gql`
  query PurchaseOrders {
    purchaseOrders {
      id
      poNumber
      supplier {
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
      items {
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
        email
        role
        active
        lastLogin
        createdAt
        updatedAt
      }
      orderDate
      receivedDate
      notes
      createdAt
      updatedAt
    }
  }
`;
// ============================START GET STOCK MMOVEMENT==============================
export const GET_STOCK_MOVEMENTS = gql`
  query StockMovements($productId: ID) {
    stockMovements(productId: $productId) {
      id
      product {
        id
        name
      }
      type
      quantity
      reason
      reference
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
      previousStock
      newStock
      createdAt
    }
  }
`;
export const GET_STOCK_MOVEMENTS_FOR_SHOP = gql`
  query GetStockMovementsByShop($productId: ID, $shopId: ID) {
    getStockMovementsByShop(productId: $productId, shopId: $shopId) {
      id
      product {
        id
        name
        sku
      }
      type
      quantity
      reason
      reference
      user {
        id
        name
      }
      previousStock
      newStock
      createdAt
    }
  }
`;
// ============================START GET STOCK MMOVEMENT==============================
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      todaySales
      totalTransactions
      averageOrderValue
      # topProducts {
      #   product {
      #     id
      #     name
      #     category
      #     image
      #   }
      #   quantitySold
      #   revenue
      # }
      lowStockItems {
        id
        name
        category
        stock
        minStock
      }
      hourlySales {
        hour
        sales
        transactions
      }
    }
  }
`;

export const GET_DASHBOARD_STATS_FOR_SHOP = gql`
  query DashboardStatsForShop($shopId: ID) {
    dashboardStatsForShop(shopId: $shopId) {
      totalTransactions
      averageOrderValue
      lowStockItems {
        id
        name
        category
        stock
        minStock
      }
      hourlySales {
        hour
        sales
        transactions
      }
      todaySales
      topProducts {
        quantitySold
        revenue
        product {
          name
          category
          cost
          minStock
          price
          sku
          stock
          image
          description
          active
        }
      }
    }
  }
`;

export const GET_SALES_REPORT = gql`
  query GetSalesReport($startDate: Date!, $endDate: Date!) {
    salesReport(startDate: $startDate, endDate: $endDate) {
      totalSales
      totalTransactions
      averageOrderValue
      salesByCategory {
        category
        sales
        quantity
      }
      salesByDay {
        date
        sales
        transactions
      }
    }
  }
`;

export const GET_SALES_REPORT_FOR_SHOP = gql`
  query SalesReportForShop($startDate: Date!, $endDate: Date!, $shopId: ID) {
    salesReportForShop(
      startDate: $startDate
      endDate: $endDate
      shopId: $shopId
    ) {
      totalSales
      totalTransactions
      averageOrderValue
      salesByCategory {
        category
        sales
        quantity
      }
      salesByDay {
        date
        sales
        transactions
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
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
`;
export const GET_SHOPS = gql`
  query GetShops {
    getShops {
      id
      shopName
      description
      createdAt
      updatedAt
    }
  }
`;
 export const  GET_ORDER_FOR_SHOP = gql`
 query GetOrderForShop($shopId: ID) {
  getOrderForShop(shopId: $shopId) {
    id
    tax
    items {
      product {
        id
        name
      }
      quantity
      total
      price
    }
    customer {
      firstName
      lastName
      phone
      email
    }
   deliveryAddress {
      formatted
    }
  }
}
`
export const GET_ORDER_COMPLETED = gql`
query GetOrderComplete($shopId: ID, $status: OrderStatus) {
  getOrderComplete(shopId: $shopId, status: $status) {
       id
    tax
    items {
      product {
        id
        name
      }
      quantity
      total
      price
    }
    customer {
      firstName
      lastName
      phone
      email
    }
   deliveryAddress {
      formatted
    }
  }
}
`