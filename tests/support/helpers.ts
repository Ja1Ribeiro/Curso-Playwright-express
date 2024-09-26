import { expect, APIRequestContext } from "@playwright/test"
import { TaskModel } from "../fixtures/task.model"

export async function deleteTaskByHelper(request, taskName) {
    await request.delete(`http://localhost:3333/helper/tasks/` + taskName);
}

export async function postTask(request: APIRequestContext, task: TaskModel) {
    const newTask = await request.post('http://localhost:3333/tasks', { data: task })
    expect(newTask.ok()).toBeTruthy()
}