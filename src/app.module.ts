import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
