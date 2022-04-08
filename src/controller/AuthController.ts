import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { validate } from "class-validator";

class AuthController {

 static login = async (req: Request, res : Response) => {

     const { username, password } = req.body; //obtenemos datos desde el body

     /**
      * @description verificamos que obtengamos las propiedades desde el front-end
      * @param {username, password}
      */
     if( !(username && password)) {
         res.status(400).json({ message : 'username y password son requeridos'});
     }

     const userRepository = getRepository(User);
     let user: User;

     /**
      * @description Hacemos la busqueda del User en la base de datos.
      * @param username
      */

     try{
         user = await userRepository.findOneOrFail({ where: {username}});
     }
     catch(e){
         return res.status(400).json({ message: 'Username o Password son incorrectos!'})
     }

     /**
      * @description Validamos el password encriptado
      * @param password
      */
     if(!user.checkPassword(password)){
         return res.status(400).json({message: 'User or Password are Incorrect'});
     }

     const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '1h'})

     //devolvemos token
     res.send({message:'OK', token});
 };

 /**
  * @descrition Permite al user cambiar su contraseña
  * 
  */

 static changePassword = async (req: Request, res : Response) => { 
     const {userId} = res.locals.jwtPayload;
     const {oldPassword, newPassword} = req.body; //obtenemos la vieja y la nueva contraseña desde el front-end

     if(!(oldPassword && newPassword)) {
         res.status(400).json({message: 'Old password y new password are required'});
     }

     //si todo va bien
     const userRepository = getRepository(User);
     let user: User;

     try{
        user = await userRepository.findOneOrFail(userId); //Conseguimos el user
     }
     catch (e) {
         res.status(400).json({message: 'Somenthing goes wrong!'});
     }

     //si todo va bien
     if(!user.checkPassword(oldPassword)){ //le pasamos el argumento oldPassword al método checkPassword
         return res.status(401).json({message: 'Check your Password'});
     }

     //si todo va bien
     //le pasamos a nuestro modelo la nueva contraseña
     user.password = newPassword;
     const validation = { validationError : {target: false, value: false}};
     const errors = await validate(user, validation);

     if(errors.length > 0){
         return res.status(400).json(errors);
     }

     //si va todo bien
     user.hashPassword();
     //guardamos cambios en la bd
     userRepository.save(user);

     //respondemos al front-end
     res.json({message: 'Password change!'});
    };
}

export default AuthController;