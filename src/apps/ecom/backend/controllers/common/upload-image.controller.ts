import { Request, Response } from "express";
import { Controller } from "../controller";
import cloudinary from "../../../../../contexts/shared/infrastructure/uploads/cloudinary";
import fs from "fs/promises";

export class UploadImageController implements Controller {
    constructor() { }

    public async invoke(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file
            console.log("file", file);
            
            if (!file) {
                res.status(400).json({ message: "File not found" });
                return;
            }

            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "ecom",
            });

            await fs.unlink(file.path);

            res.status(200).json({
                message: "File uploaded successfully",
                url: uploadResult.secure_url,
            });

        } catch (error) {
            res.status(500).json({
                message: "Error uploading file",
                error: error,
            });
        }




    }
}