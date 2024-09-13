import { Body, Controller, Get, Post, Param, Patch, Delete, Query, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreatetaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto"
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { Task } from "./entities/task.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";
import {Logger } from "@nestjs/common"


@Controller("task")
@UseGuards(AuthGuard())
export class TaskController {
    private logger = new Logger("TasksController")
    constructor(private taskService: TaskService) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retriving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.taskService.getTasks(filterDto, user)
    }

    @Get("/:id")
    getTaskById(@Param("id") id: string,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.getTaskWithId(id, user)
    }

    @Post()
    creatTask(
        @Body() createTaskDto: CreatetaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
        return this.taskService.createTask(createTaskDto, user)
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id") id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUser() user: User): Promise<Task> {
        const { status } = updateTaskStatusDto
        return this.taskService.updateTaskStatus(id, status , user)
    }

    @Delete("/:id")
    deleteTask(@Param("id") id: string , @GetUser() user: User ): Promise<void> {
        return this.taskService.deleteTask(id , user)
    }
}