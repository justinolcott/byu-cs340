// const feedTable = new dynamodb.TableV2(this, "FeedTable", {
//   partitionKey: { name: "receiverAlias", type: dynamodb.AttributeType.STRING },
//   sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
//   tableName: "FeedTable",
//   billing: dynamodb.Billing.provisioned(
//     {
//       readCapacity: dynamodb.Capacity.fixed(1),
//       writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
//     }
//   )
// });

import { FeedTableDAO } from "../../dao/DAOInterfaces";
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

export class FeedTableAWSDAO implements FeedTableDAO {
  readonly tableName: string = "FeedTable";

  async putStatus(status: Status, senderAlias: string, receiverAlias: string): Promise<void> {
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
          receiverAlias: receiverAlias,
          timestamp: status.timestamp,
          status: status.dto,
          senderAlias: senderAlias
        }
      })
    );
  }

  async loadMoreFeedItems(receiverAlias: string, lastStatus: Status | null, pageSize: number): Promise<[Status[], boolean]> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const result = await client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "#receiverAlias = :receiverAlias",
        ExpressionAttributeNames: {
          "#receiverAlias": "receiverAlias"
        },
        ExpressionAttributeValues: {
          ":receiverAlias": receiverAlias
        },
        ExclusiveStartKey: lastStatus === null ? undefined : {
          receiverAlias: receiverAlias,
          timestamp: lastStatus.timestamp
        },
        Limit: pageSize
      })
    );

    const statuses: Status[] = result.Items?.map((item) => new Status(
      item.status.post,
      item.status.user,
      item.timestamp
    )) ?? [];

    const hasMore = !!result.LastEvaluatedKey;

    return [statuses ?? [], hasMore];
  }
}