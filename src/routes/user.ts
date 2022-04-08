import { Router } from "express";
import { UserController } from "../controller/UserController";

//midleware para proteger rutas
import { checkJwt } from "../middlewares/jwt";
import { checkRole } from "../middlewares/role";


const router = Router();

//Get all users
router.get('/',  [checkJwt, checkRole(['admin'])], UserController.getAll); //si todo pasa por checkJwt se ejecuta el siguiente método

//un usuario
router.get('/:id',  [checkJwt, checkRole(['admin'])], UserController.getById);

//crear nuevo usuario
router.post('/', [checkJwt, checkRole(['admin'])],  UserController.newUser); //solo podrá ingresar el admin

//edit
router.patch('/:id',  [checkJwt, checkRole(['admin'])], UserController.editUser);

//delete
router.delete('/:id',  [checkJwt, checkRole(['admin'])], UserController.deleteUser);

export default router;