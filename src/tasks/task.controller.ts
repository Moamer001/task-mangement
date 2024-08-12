import { Body, Controller, Get, Post,Param ,Patch ,Delete, Query} from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task ,TaskStatus } from "./task.model";
import { CreatetaskDto } from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto"


@Controller("task")
export class TaskController{
    constructor(private taskService:TaskService){}

    @Get()
    getTasks(@Query() filterDto : GetTasksFilterDto):Task[]{
       if(Object.keys(filterDto).length){
        return this.taskService.getTasksWithFilters(filterDto)
       }else{
       return this.taskService.getAllTasks()
       }
    }
    @Get("/:id")
    getTaskById(@Param("id") id : string){
        return this.taskService.getTaskById(id)
    }

    @Post()
    creatTask(
        @Body() createTaskDto:CreatetaskDto
    ):Task{
        return this.taskService.createTask(createTaskDto)
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id") id:string ,
        @Body("status") status:TaskStatus
    ):Task{
        return this.taskService.updateTaskStatus(id,status)
    }

    @Delete()
    deleteTask(id:string):void{
        return this.taskService.deleteTask(id)
    }
}