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

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('create todo item function')
        const result = await this.docClient
        .put({
            TableName: this.todosTable,
            Item: todoItem
        })
        .promise()
        logger.info('Todo item created', result)
        return todoItem as TodoItem
    }

    async updateTodoItem(
        todoId: string,
        userId: string,
        todoUpdate: TodoUpdate
        ): Promise<TodoUpdate> {
            logger.info('Updating Todo')
            const result = await this.docClient.update(
                {
                    TableName: this.todosTable,
                    Key: {
                        "userId": userId,
                        "todoId": todoId
                    },
                    UpdateExpression: "set #a = :a, #b = :b, #c = :c",
                    ExpressionAttributeNames: {
                        "#a": "name",
                        "#b": "dueDate",
                        "#c": "done"
                    },
                    ExpressionAttributeValues: {
                        ":a": todoUpdate['name'],
                        ":b": todoUpdate['dueDate'],
                        ":c": todoUpdate['done']
                    },
                    ReturnValues: "ALL_NEW"
                })
                .promise()
        const attributes = result.Attributes
        return attributes as TodoUpdate
    }

}
