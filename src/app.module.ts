import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config"
import { ConfigService } from "@nestjs/config"
import { configValidationSchema } from "./config.schema"

@Module({
  imports: [TaskModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get("STAGE") === "prod";
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null
          },
          type: "postgres",
          url: configService.get("DB_URL"),
          synchronize: true,
          autoLoadEntities: true,
        }
      }
    }),

    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
