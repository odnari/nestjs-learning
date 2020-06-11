import {Injectable, NotFoundException} from '@nestjs/common';
import {TaskStatus} from "./task-status.enum";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {
    }

    async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(getTasksFilterDto)
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne({id})

        if (!found) {
            throw new NotFoundException(`Task with id(${id}) not found.`)
        }

        return found
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto)
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const found = await this.getTaskById(id)

        found.status = status
        await found.save()

        return found
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id)

        if (!result.affected) {
            throw new NotFoundException(`Task with id(${id}) not found.`)
        }
    }
}
