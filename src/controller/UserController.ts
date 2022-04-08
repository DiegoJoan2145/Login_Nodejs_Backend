import {getRepository, getTreeRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";

export class UserController {

   static getAll = async (req: Request, res: Response) => {
       const userRepository = getRepository(User);
       let users;
       try{
       users = await userRepository.find();
       } catch(e){
            res.status(404).json( { message : 'Something goes wrong!'});
       }
       if(users.length > 0) {
           res.send(users);
       } else {
           res.status(404).json( { message : 'No hay resultado'});
       }
   };

   static getById = async (req: Request, res: Response) => {
       const {id} = req.params;
       const userRepository = getRepository(User);

       try{
           const user = await userRepository.findOneOrFail(id);
           res.send(user);
       } catch (e) {
           res.status(404).json( {message : 'No hay resultado'});
       }

   }

   static newUser = async (req: Request, res: Response) => {
       const { username, password, role } = req.body;
       const user = new User();

       user.username = username;
       user.password = password;
       user.role = role;


       //validate
       const validation = { validationError: {target:false, value: false}}//no mostraramos estos datos
       const errors = await validate(user, validation);
       if(errors.length > 0){
           return res.status(400).json(errors);
       }

       const userRepository = getRepository(User)

       try{
           user.hashPassword();//llamammos al método creado en entity User para encriptar contraseña
           await userRepository.save(user);
       }
       catch(e){
           return res.status(409).json({ message : 'Username already exist' });
       }

       //ok
       res.send('User Created');
   };


   static editUser = async (req: Request, res: Response) => {
       let user;
       const {id} = req.params;
       const {username, role} = req.body;

       const userRepository = getRepository(User);

       try{
           user = await userRepository.findOneOrFail(id);
       }
       catch(e){
           return res.status(404).json({ message : 'usuario no encontrado' });
       }

       user.username = username;
       user.role = role;

       const validation = { validationError: {target:false, value: false}}//no mostraramos estos datos

       const errors = await validate(user, validation);
       if(errors.length > 0){
           return res.status(400).json(errors);
       }

       try {
        await userRepository.save(user);
       } catch(e){
           return res.status(409).json({ message : 'usuario ya existe' });

       }
       res.status(201).json({ message: 'usuario actualizado'});
   };

   static deleteUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const userRepository = getRepository(User);
    let user: User;

    try{
        user = await userRepository.findOneOrFail(id);
    } catch(e){
        return res.status(404).json({ message : 'usuario no encontrado' });

    }

    //delete
    userRepository.delete(id);
    res.status(201).json({ message : 'usuario eliminado' });

   };
    

}

export default UserController;