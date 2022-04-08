import {Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn, Column} from "typeorm";

import { MinLength, IsNotEmpty, isEmail, IsEmail } from "class-validator";

import * as bcrypt from "bcryptjs";

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    /**
     * @description Cuando los usuarios se intenten logear
     * @param password desde el frontend
     * @returns boolean
     */

    checkPassword(password: string): boolean{
        return bcrypt.compareSync(password, this.password)
    }

}
