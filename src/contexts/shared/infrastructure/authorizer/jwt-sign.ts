import jwt from 'jsonwebtoken';
import { Payload } from '../../domain/interface/payload';

export const JWTSign = (
    payload: Payload,
    secret: string,
    options: jwt.SignOptions,
    refreshOptions: jwt.SignOptions,
): {
    access_token: string;
    refresh_token: string;
} => {
    const access_token = jwt.sign(payload, secret, options);
    const refresh_token = jwt.sign(payload, secret, refreshOptions);

    return {
        access_token,
        refresh_token,
    }
}
