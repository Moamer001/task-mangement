import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy ,ExtractJwt } from "passport-jwt"
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./jwt-payload.interface";
import {ConfigService} from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor( 
    @InjectRepository(User) private usersRepository: Repository<User> ,
    private configService:ConfigService
  ){
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:configService.get("JWT_SECRET")
    })
  }

  async validate(payload:JwtPayload):Promise<User>{
    const {username} = payload ;
    const user:User = await this.usersRepository.findOne({where:{username}})

    if(!user){
      throw new UnauthorizedException()
    }

    return user;
  }
  
}