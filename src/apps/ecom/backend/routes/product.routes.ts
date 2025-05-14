import {  Router } from "express";
import * as controller from "../controllers";

export const ProductRouter = (getAllProductsController: controller.GetAllProductsController, router: Router): Router => {

    router.post("/products", getAllProductsController.invoke.bind(getAllProductsController)
        /*#swagger.tags = ['Products']
        #swagger.description = 'Get all products',
        
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */
    
)

    return router
}