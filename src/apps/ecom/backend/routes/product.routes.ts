import {  Router } from "express";
import * as controller from "../controllers";

export const ProductRouter = (getAllProductsController: controller.GetAllProductsController,getProductByIdController:controller.GetProductByIdController, GetAllCategoriesController: controller.GetAllCategoriesController, getProductsByCategoryController: controller.GetProductsByCategoryController,router: Router): Router => {

    router.get("/products", getAllProductsController.invoke.bind(getAllProductsController)
        /*
        #swagger.tags = ['Products']
        #swagger.description = 'Get all products',
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */
    
)

router.get("/product/:productId", getProductByIdController.validate, getProductByIdController.invoke.bind(getProductByIdController)
        /*
        #swagger.tags = ['Products']
        #swagger.description = 'Get Product By Id',
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */
)

router.get("/categories", GetAllCategoriesController.invoke.bind(GetAllCategoriesController)
        /*
        #swagger.tags = ['Products']
        #swagger.description = 'Get all categories',
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */
)

router.get("/products/category/:categoryId", getProductsByCategoryController.validate, getProductsByCategoryController.invoke.bind(getProductsByCategoryController)

        /*
        #swagger.tags = ['Products']
        #swagger.description = 'Get products by category',
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */)

    return router
}