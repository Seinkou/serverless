import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { promises } from 'fs'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient= new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) {}
    async getAllTodos(userId: string): Promise<TodoItem[]>{
        logger.info('Get all todo function')

        const result = await this.docClient
        .query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId' : userId
            }
        })
        .promise()

        const item = result.Items
        return item as TodoItem[]
    }

    async createTodoItem(TodoItem: TodoItem): Promise<TodoItem> {
        logger.info('create todo item function')
        const result = await this.docClient
        .put({
            TableName: this.todosTable,
            Item: TodoItem
        })
        .promise()
        logger.info('Todo item created', result)
        return TodoItem
    }

    async updateTodoItem(
        todoId: string,
        userId: string,
        TodoUpdate: TodoUpdate
    )

}
