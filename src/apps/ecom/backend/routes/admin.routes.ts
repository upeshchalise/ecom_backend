import { NextFunction, Request, Response, Router } from "express";
import * as controller from "../controllers";
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";

export const AdminRouter = (adminCreateCategoryController: controller.AdminCreateCategoryController, adminCreateProductController: controller.AdminCreateProductController,adminAuthorizer: IAuthorizer<Request, Response, NextFunction>,userAuthorizer: IAuthorizer<Request, Response, NextFunction>, router: Router): Router => {

    router.post("/admin/category", adminAuthorizer.authorize, adminCreateCategoryController.invoke.bind(adminCreateCategoryController)
        /*#swagger.tags = ['Admin']
        #swagger.description = 'Admin Create Category API',
        #swagger.requestBody ={
                schema : {
                    $ref: "#/components/schemas/createCategory"
                }
            }
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */
    )

    router.post("/admin/product", userAuthorizer.authorize, adminCreateProductController.invoke.bind(adminCreateProductController)

    /*#swagger.tags = ['Admin']
        #swagger.description = 'Admin Create Products API',
        #swagger.requestBody ={
                schema : {
                    $ref: "#/components/schemas/createProduct"
                }
            }
                 #swagger.security = [{
              "bearerAuth": []
          }]
        */
)

    return router
}