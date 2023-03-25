import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('todosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// get Todo function
export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    logger.info('Get todo function')
    return todosAccess.getAllTodos(userId)    
}

// Create TODO function
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Create TODO function')
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }
    return await todosAccess.createTodoItem(newItem)
}

//Update to do function
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
): Promise<TodoUpdate>{
    logger.info('Update todo function')
    return await todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

// delete todo function
export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<string>{
    logger.info('Delete todo function')
    return todosAccess.deleteTodoItem(todoId, userId)
}

// create attachement function
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
): Promise<string>{
    logger.info('create attachment function', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId)
}