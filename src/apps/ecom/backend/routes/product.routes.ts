import { Request, Response, NextFunction, Router } from "express";
import * as controller from "../controllers";
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";


export const ProductRouter = (getAllProductsController: controller.GetAllProductsController, getProductByIdController: controller.GetProductByIdController, GetAllCategoriesController: controller.GetAllCategoriesController, getProductsByCategoryController: controller.GetProductsByCategoryController, updateUserInteractionController: controller.UpdateUserInteractionController, getRecommendedProductController: controller.GetRecommendedProductController, userAuthorizer: IAuthorizer<Request, Response, NextFunction>, router: Router): Router => {

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


  router.post("/user/interaction", userAuthorizer.authorize, updateUserInteractionController.validate, updateUserInteractionController.invoke.bind(updateUserInteractionController)
    /*
  #swagger.tags = ['Products']
  #swagger.description = 'Update user interaction',
           #swagger.security = [{
        "bearerAuth": []
}]
  */
  )

  router.get("/user/recommended-products", userAuthorizer.authorize, getRecommendedProductController.invoke.bind(getRecommendedProductController)
    /*
  #swagger.tags = ['Products']
  #swagger.description = 'Update user interaction',
           #swagger.security = [{
        "bearerAuth": []
}]
  */
  )
  return router
}