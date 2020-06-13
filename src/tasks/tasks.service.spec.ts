import {Test} from '@nestjs/testing'
import {TasksService} from './tasks.service'
import {TaskRepository} from "./task.repository";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskStatus} from "./task-status.enum";

const mockTaskRepository = () => ({
    getTasks: jest.fn()
})

const mockUser = {
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
})
