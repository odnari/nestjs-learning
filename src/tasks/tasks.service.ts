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

    // private tasks: Task[] = []
    //
    // getAllTasks(): Task[] {
    //     return this.tasks
    // }
    //
    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const {status, search} = filterDto
    //
    //     let tasks = this.getAllTasks()
    //
    //     if (status) {
    //         tasks = tasks.filter(t => t.status === status)
    //     }
    //
    //     if (search) {
    //         tasks = tasks.filter(t => t.title.includes(search) || t.description.includes(search))
    //     }
    //
    //     return tasks
    // }

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

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const found = this.getTaskById(id)
    //
    //     found.status = status
    //
    //     return found
    // }
    //
    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id)
    //
    //     this.tasks = this.tasks.filter(t => t.id !== found.id)
    // }
}
