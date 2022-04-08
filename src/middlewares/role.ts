/**
 * @description Para validar el rol del usuario, este midleware se ejecuta en el archivo de rutas User.ts
 */

import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const checkRole = (roles:Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const {userId} = res.locals.jwtPayload;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(userId); //consultamos en la base de datos
        } catch(e) {
            res.status(401).json({message: 'Not Autorized'});
        }

        //check
        const {role} = user;
        if(roles.includes(role)){
            next(); //si coincide el role del user pasa al siguiente método
        } else {
            res.status(401).json({message: 'Not Autorized'});
        }
    }
}