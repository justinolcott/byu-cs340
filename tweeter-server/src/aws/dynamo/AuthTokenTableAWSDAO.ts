/*
const authTokenTable = new dynamodb.TableV2(this, "AuthTokenTable", {
      partitionKey: { name: "token", type: dynamodb.AttributeType.STRING },
      tableName: "AuthTokenTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      )
    });
*/

/**
  export class AuthToken {
  private _token: string;
  private _timestamp: number;
 */

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenTableDAO } from "../../dao/DAOInterfaces";
import { AuthToken, User } from "tweeter-shared";

export class AuthTokenAWSDAO implements AuthTokenTableDAO {
  readonly tableName: string = "AuthTokenTable";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putAuthToken(authToken: AuthToken, alias: string): Promise<boolean> {
    const authTokenDto = authToken.dto;
    const item = {
      token: authTokenDto.token,
      timestamp: authTokenDto.timestamp,
      alias: alias,
    }

    const result = await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
    return result.$metadata.httpStatusCode === 200;
  }

  async getAuthToken(token: string): Promise<AuthToken | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          token: token,
        },
      })
    );

    return new AuthToken(result.Item?.token, result.Item?.timestamp);
  }
 
  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          "token": token,
        },
      })
    );
  }

  async updateAuthToken(authToken: AuthToken): Promise<void> {
    await this.client.send(
      new UpdateCommand({
      TableName: this.tableName,
      Key: {
        token: authToken.token,
      },
      UpdateExpression: "set #ts = :timestamp",
      ExpressionAttributeNames: {
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":timestamp": Date.now(),
      },
      })
    );
  }

  async getAllTokens(): Promise<AuthToken[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
      })
    );

    return result.Items?.map((item: any) => new AuthToken(item.token, item.timestamp)) ?? [];
  }

  async deleteAllTokens(): Promise<void> {
    const tokens = await this.getAllTokens();
    for (const token of tokens) {
      await this.deleteAuthToken(token.token);
    }
  }

  async deleteAllExpiredTokens(): Promise<void> {
    const tokens = await this.getAllTokens();
    const now = Date.now();
    for (const token of tokens) {
      if (token.timestamp < now) {
        await this.deleteAuthToken(token.token);
      }
    }
  }

  async getAlias(token: string): Promise<string | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          token: token,
        },
      })
    );
    return result.Item?.alias;
  }

}

