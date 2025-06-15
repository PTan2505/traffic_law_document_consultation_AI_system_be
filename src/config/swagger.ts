import express, { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title:                'Traffic Law Conversation API',
            version: '1.0.0',
            description:                'API documentation for the Traffic Law Conversation system',
        },
        servers: [
            {
                url: `http://localhost:${process.env.SWAGGER_PORT || 3001}`,
                description: 'Development server',
            },
        ],        components: {
            schemas: {
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/ConversationResponseDto'
                            }
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: {
                                    type: 'integer',
                                    description: 'Total number of records'
                                },
                                page: {
                                    type: 'integer',
                                    description: 'Current page number'
                                },
                                lastPage: {
                                    type: 'integer',
                                    description: 'Last page number'
                                }
                            }
                        }
                    }
                },
                CreateConversationDto: {
                    type: 'object',
                    required: ['userId', 'title'],
                    properties: {
                        userId: {
                            type: 'integer',
                            description: 'ID of the user creating the conversation',
                        },
                        title: {
                            type: 'string',
                            description: 'The conversation title',
                        },
                        context: {
                            type: 'string',
                            description: 'Additional context for the conversation',
                        },
                    },
                },
                UpdateConversationDto: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Updated conversation title',
                        },
                        context: {
                            type: 'string',
                            description: 'Updated context for the question',
                        },
                    },
                },
                ConversationResponseDto: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Conversation ID',
                        },
                        userId: {
                            type: 'integer',
                            description: 'User ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Conversation title',
                        },
                        context: {
                            type: 'string',
                            description: 'Context for the conversation',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/controllers/*.ts'], // Path to the API docs
};

export const setupSwagger = (app: Application) => {
    const specs = swaggerJsdoc(swaggerOptions);
    // @ts-ignore
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
