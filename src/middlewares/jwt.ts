import { Resolver } from "dns";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['auth'];
    let jwtPayload;

    console.log('REQ->', req.headers);

    try{
        jwtPayload = <any>jwt.verify(token, config.jwtSecret); //verificamos token, le pasamos la llave secreta
        res.locals.jwtPayload = jwtPayload; //almacenamos en res.locals
    }
    catch(e){
        return res.status(401).json({message: 'Not Autorized'});
    }

    const {userId, username} = jwtPayload; //obtenemos datos de jwtPayload

    //creamos nuevo token
    const newToken = jwt.sign({userId, username}, config.jwtSecret, { expiresIn: '1h'}); //el token expira en 1 hora
    res.setHeader('token', newToken); //lo devolvemos al front-end con un setHeader

    //llamamos el siguiente método
    next();

}