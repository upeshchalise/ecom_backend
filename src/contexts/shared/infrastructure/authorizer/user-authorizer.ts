import { UserRole } from '@prisma/client';
import { RequestHandler as Middleware, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP401Error } from '../../domain/errors/http.exception';
import { Payload, TokenScope } from '../../domain/interface/payload';
import { IAuthorizer } from '../../domain/interface/IAuthorizer';

export class JWTUserAuthorizer implements IAuthorizer<Request, Response, NextFunction> {
    public authorize : Middleware = async (req:any,res:Response, next: NextFunction):Promise<void> => {
        const {authorization} = req.headers;
        const tokenArray = authorization !== undefined ? authorization.split(' ') : [];
        const token = tokenArray[1];
        try {
            const validRoles = [UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER];
            const payload: Payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Payload
            if(validRoles.includes(payload.role as any) && (payload.scope.includes(TokenScope.ADMIN_ACCESS) || payload.scope.includes(TokenScope.USER_ACCESS))) {
                req.user = payload;
                return next()
            } else {
                return next(new HTTP401Error())
            }
        } catch (error) {
            return next(new HTTP401Error())
        }
    }
}