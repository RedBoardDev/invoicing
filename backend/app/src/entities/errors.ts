/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorObject:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         httpCode:
 *           type: integer
 *           description: HTTP status code
 *         statusCode:
 *           type: integer
 *           description: Application-specific status code
 *         statusKey:
 *           type: string
 *           description: Application-specific status key
 *         details:
 *           type: string[]
 *           description: Detailed validation error items
 *       required:
 *         - message
 *         - httpCode
 *         - statusCode
 *         - statusKey
 */
export interface ErrorObject {
  message: string;
  httpCode: number;
  statusCode: number;
  statusKey: string;
  details?: unknown;
}
