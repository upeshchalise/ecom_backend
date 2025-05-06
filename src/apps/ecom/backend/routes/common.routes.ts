import { Router } from "express";
import * as controller from "../controllers";
import { upload } from "../../../../contexts/shared/infrastructure/uploads/multer";

export const CommonRouter = (uploadImageController: controller.UploadImageController, router: Router): Router => {

    router.post("/upload", upload.single("file"), uploadImageController.invoke.bind(uploadImageController),
        /*#swagger.tags = ['Upload Image']
        #swagger.description = 'Upload Image API',
        #swagger.requestBody ={
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            file: {
                                type: 'string',
                                format: 'binary'
                            }
                        }
                    }
                }
            }
        }
        */

    )
    return router
}