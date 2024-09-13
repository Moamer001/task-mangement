import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredintialDto } from './dto/auth-credintial.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor( @InjectRepository(User) 
    private userRepository:Repository<User>,
    private jwtService:JwtService
){}

    async signUp(authCredintialDto:AuthCredintialDto):Promise<void>{
         const {password,username} = authCredintialDto
         const salt = await bcrypt.genSalt()
         const hashedPassword = await bcrypt.hash(password,salt)

         const user = this.userRepository.create({username ,password:hashedPassword})
         try {
        await this.userRepository.save(user)
            
         } catch (error) {
            if(error.code === '23505'){
                throw new ConflictException("username already exists")
            }
            throw new InternalServerErrorException()
         }
    }

    async signIn (authCredintialDto:AuthCredintialDto):Promise<{accessToken:string}>{
        const {username , password} = authCredintialDto
        const user = await this.userRepository.findOne({where:{username}}) 

        if(user && (await bcrypt.compare(password , user.password) )){
            const payload :JwtPayload = {username}
            const accessToken = await this.jwtService.sign(payload)
            return {accessToken}
        } else{
            throw new UnauthorizedException("Please check your login credentials") ;
        }
    }
} 
