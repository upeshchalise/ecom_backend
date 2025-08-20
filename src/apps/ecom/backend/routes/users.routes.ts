import { NextFunction,Request,Response, Router } from "express";
import * as controller from "../controllers";
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";

export const UsersRouter = (createUserController: controller.CreateUserController,getUserByIdController:controller.GetUserByIdController,userLoginController: controller.UserLoginController,updateUserController: controller.UpdateUserController,userAuthorizer: IAuthorizer<Request, Response, NextFunction>, router: Router): Router => {

    router.post("/user", createUserController.validate, createUserController.invoke.bind(createUserController)
        /*#swagger.tags = ['User']
        #swagger.description = 'Create User API',
        #swagger.requestBody ={
            schema : {
                $ref: "#/components/schemas/createUser"
            }
        }
        */
    );

    router.get("/user/profile", userAuthorizer.authorize,getUserByIdController.invoke.bind(getUserByIdController)
        /*#swagger.tags = ['User']
        #swagger.description = 'Get User By Id API',
        */
    );

    router.post("/user/login", userLoginController.validate, userLoginController.invoke.bind(userLoginController)
     /*#swagger.tags = ['User']
        #swagger.description = 'User Login API',
        #swagger.requestBody ={
            schema : {
                $ref: "#/components/schemas/loginUser"
            }
        }
        */
)

router.put("/user/:userId", updateUserController.validate, updateUserController.invoke.bind(updateUserController)
/*#swagger.tags = ['User']
        #swagger.description = 'Update User API',
        #swagger.requestBody ={
            schema : {
                $ref: "#/components/schemas/updateUser"
            }
        }
        */
)
    return router
}