import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredintialDto } from './dto/auth-credintial.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signup")
  signUp(@Body() authCredintialDto: AuthCredintialDto): Promise<void> {
    return this.authService.signUp(authCredintialDto)
  }

  @Post("/signin")
  sigIn(@Body() authCredintialDto: AuthCredintialDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredintialDto)
  }

  
}
