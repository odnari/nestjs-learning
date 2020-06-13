import {Test} from '@nestjs/testing'
import {TasksService} from './tasks.service'
import {TaskRepository} from "./task.repository";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskStatus} from "./task-status.enum";
import {NotFoundException} from "@nestjs/common";
import {CreateTaskDto} from "./dto/create-task.dto";
import mock = jest.mock;

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
})

const mockUser = {
    id: 12,
    username: 'Tester'
}

describe('Tasks Service', () => {
    let tasksService
    let taskRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile()

        tasksService = await module.get<TasksService>(TasksService)
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    })

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue')
            const filters: GetTasksFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'Some search'
            }

            expect(taskRepository.getTasks).not.toHaveBeenCalled()
            const result = await tasksService.getTasks(filters, mockUser)
            expect(taskRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('someValue')
        })
    })

    describe('getTaskById', () => {
        it('call taskRepository.findOne and returns a task', async () => {
            const mockTask = {title: 'some title', description: 'some desc'}
            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await tasksService.getTaskById(1, mockUser)
            expect(result).toEqual(mockTask)
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: 12
                }
            })
        })

        it('returns an error if task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null)

            await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask', () => {
        it('creates a task and returns the result', async () => {
            const mockTask: CreateTaskDto = {title: 'some title', description: 'some desc'}
            taskRepository.createTask.mockResolvedValue(mockTask)

            const result = await tasksService.createTask(mockTask, mockUser)
            expect(result).toEqual(mockTask)
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser)
        })
    })

    describe('deleteTask', () => {
        it('deletes task by id', async () => {
            taskRepository.delete.mockResolvedValue({
                affected: 1
            })

            await tasksService.deleteTask(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id})
        })

        it('throws an error if there is not task with id', async () => {
            taskRepository.delete.mockResolvedValue({
                affected: 0
            })

            await expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('updateTaskStatus', () => {
        it('updates task status', async () => {
            const save = jest.fn().mockResolvedValue(true)
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            })

            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser)
            expect(tasksService.getTaskById).toHaveBeenCalled()
            expect(save).toHaveBeenCalled()
            expect(result.status).toEqual(TaskStatus.DONE)
        })
    })
})
