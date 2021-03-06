import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRespository";
import * as yup from 'yup'; 
import { AppError } from "../errors/AppError";

class UserController {
    async create(request: Request, response: Response){
      const { name, email } = request.body;

      const schema = yup.object().shape({
        name: yup.string().required("Nome é obrigatorio sua anta!"),
        email: yup.string().email().required("Você errou seu proprio email"),
      });

      try{
        await schema.validate(request.body, { abortEarly: false })
      } catch (err) { 
        throw new AppError(err);
      }
      
      
      const usersRepository = getCustomRepository(UsersRepository);
      
      const userAlreadyExists = await usersRepository.findOne({
        email,
      });

      if(userAlreadyExists) {
        throw new AppError("Este usuario já existe");
      }

      const user = usersRepository.create({
        name, email
      });

      await usersRepository.save(user);

      return response.status(201).json(user);
    }
}


export { UserController };
