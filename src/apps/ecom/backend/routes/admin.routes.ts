import { NextFunction, Request, Response, Router } from "express";
import * as controller from "../controllers";
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";

export const AdminRouter = (adminCreateCategoryController: controller.AdminCreateCategoryController, adminCreateProductController: controller.AdminCreateProductController,adminGetAllCategories: controller.AdminGetAllCategories,adminGetProductsByCategoryIdController: controller.AdminGetProductsByCategoryIdController,adminGetAllUsersController: controller.AdminGetAllUsersController,adminGetSalesAnalyticsController: controller.AdminGetSalesAnalyticsController,adminAuthorizer: IAuthorizer<Request, Response, NextFunction>,userAuthorizer: IAuthorizer<Request, Response, NextFunction>, router: Router): Router => {

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

router.get("/admin/categories", adminAuthorizer.authorize, adminGetAllCategories.invoke.bind(adminGetAllCategories)
    /**
     * #swagger.tags = ['Admin']
     * #swagger.description = 'Admin Get All Categories API',
     * #swagger.security = [{
          "bearerAuth": []
      }]
     */

)

router.get("/admin/products/category/:id", adminAuthorizer.authorize, adminGetProductsByCategoryIdController.invoke.bind(adminGetProductsByCategoryIdController)
    /**
     * #swagger.tags = ['Admin']
     * #swagger.description = 'Admin Get Products By Category ID API',
     * #swagger.security = [{
          "bearerAuth": []
      }]
     */

)

router.get("/admin/users", adminAuthorizer.authorize, adminGetAllUsersController.invoke.bind(adminGetAllUsersController)
    /**
     * #swagger.tags = ['Admin']
     * #swagger.description = 'Admin Get All Users API',
     * #swagger.security = [{
          "bearerAuth": []
      }]
     */

)

router.get("/admin/sales/analytics", adminAuthorizer.authorize, adminGetSalesAnalyticsController.invoke.bind(adminGetSalesAnalyticsController)
    /**
     * #swagger.tags = ['Admin']
     * #swagger.description = 'Admin Get Sales Analytics API',
     * #swagger.security = [{
          "bearerAuth": []
      }]
     */

)

    return router
}