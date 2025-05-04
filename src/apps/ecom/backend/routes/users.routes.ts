import { Router } from "express";
import * as controller from "../controllers";

export const UsersRouter = (createUserController: controller.CreateUserController, router: Router): Router => {
    
    router.post("/user", createUserController.invoke.bind(createUserController)
    /*#swagger.tags = ['User']
    #swagger.description = 'Create User API'
    */
);
    
    return router
}