


/**
 * AWS CDK for reference
 *     const storyTable = new dynamodb.TableV2(this, "StoryTable", {
      partitionKey: { name: "senderAlias", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
      tableName: "StoryTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      )
    });
 */

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
import { StoryTableDAO } from "../../dao/DAOInterfaces";

export class StoryTableAWSDAO implements StoryTableDAO {
  readonly tableName: string = "StoryTable";
  readonly pageSize: number = 10;

  async putStory(status: Status): Promise<void> {
    const client = DynamoDBDocumentClient.from(
      new DynamoDBClient(), {
        marshallOptions: {
          convertClassInstanceToMap: true,
        }
      }
    );
    await client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          senderAlias: status.user.alias,
          timestamp: status.timestamp,
          status: status,
        }

      })
    );
  }

  async getStory(senderAlias: string): Promise<Status | null> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const result = await client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          senderAlias: senderAlias,
        }
      })
    );
    return new Status(
      result.Item?.status.post,
      result.Item?.status.timestamp,
      result.Item?.status.user
    )
  }

  async deleteStory(senderAlias: string): Promise<void> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    await client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          senderAlias: senderAlias,
        }
      })
    );
  }

  async loadMoreStories(senderAlias: string, lastStatus: Status | null): Promise<[Status[], boolean]> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    
    const result = await client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "#senderAlias = :senderAlias",
        ExpressionAttributeNames: {
          "#senderAlias": "senderAlias",
        },
        ExpressionAttributeValues: {
          ":senderAlias": senderAlias,
        },
        ExclusiveStartKey: lastStatus === null ? undefined : {
          senderAlias: senderAlias,
          timestamp: lastStatus.timestamp,
        },
        Limit: this.pageSize,
      })
    );

    const statuses = result.Items?.map((item) => new Status(
      item.status.text,
      item.status.timestamp,
      item.status.user
    ));
    const hasMore = !!result.LastEvaluatedKey;

    return [statuses ?? [], hasMore];
  }
}