import { GoneException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task-status.enum";
import { CreatetaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/auth/user.entity";
import {Logger} from "@nestjs/common"

@Injectable()
export class TaskService {
    private logger = new Logger("TasksRepository")
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) { }


    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { search, status } = filterDto
        const query = this.taskRepository.createQueryBuilder("task")
        query.where({ user })
        if (status) {
            query.andWhere("task.status = :status", { status })
        }
        if (search) {
            query.andWhere("(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))", { search: `%${search}%` },)
        }
        try {
            const tasks = await query.getMany()
            return tasks
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,error.stack) ;
            // throw new InternalServerErrorException()
        }
    }


    async getTaskWithId(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, user } })
        if (!found) {
            throw new NotFoundException(`task with ID "${id}" not fonud`)
        }
        return found
    }



    async createTask(createTaskDto: CreatetaskDto, user: User): Promise<Task> {
        const { description, title } = createTaskDto;
        const task = this.taskRepository.create({ description, title, user });
        await this.taskRepository.save(task);
        return task
    }


    async deleteTask(id: string, user: User): Promise<void> {
        const task = await this.taskRepository.delete({ id, user })
        if (task.affected === 0) {
            throw new NotFoundException(`task with ID "${id}" not found `)
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskWithId(id, user)
        task.status = status
        await this.taskRepository.save(task)
        return task
    }
}