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
  BatchWriteCommand,
  
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

  async putBatchStatus(status: Status, senderAlias: string, receiverAliases: string[]): Promise<void> {
    const client = DynamoDBDocumentClient.from(
      new DynamoDBClient(), {
        marshallOptions: {
          convertClassInstanceToMap: true,
        }
      }
    );

    const putRequests = receiverAliases.map((receiverAlias) => ({
      PutRequest: {
        Item: {
          receiverAlias: receiverAlias,
          timestamp: status.timestamp,
          status: status.dto,
          senderAlias: senderAlias
        }
      }
    }));

    console.log("putRequests: ", putRequests)

    // send batch write request for every 25 items even if the number of items is less than 25
    try {
      for (let i = 0; i < putRequests.length; i += 25) {
        await client.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.tableName]: putRequests.slice(i, i + 25)
            }
          })
        );
      }
    } catch (e) {
      console.log("Error in batch write: ", e)
    }

    // await client.send(
    //   new BatchWriteCommand({
    //     RequestItems: {
    //       [this.tableName]: putRequests
    //     }
    //   })
    // );   
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
        ScanIndexForward: false,
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

  // async deleteFeedItem(receiverAlias: string, timestamp: number): Promise<void> {
  //   const client = DynamoDBDocumentClient.from(new DynamoDBClient());
  //   await client.send(
  //     new DeleteCommand({
  //       TableName: this.tableName,
  //       Key: {
  //         receiverAlias: receiverAlias,
  //         timestamp: timestamp
  //       }
  //     })
  //   );
  // }

//   async clearAllStatus(): Promise<void> {
//     const senderAlias = "mainalias";
//     const client = DynamoDBDocumentClient.from(new DynamoDBClient());

//     // receiverAlias is any
//     const result = await client.send(
//       new QueryCommand({
//         TableName: this.tableName,
//         KeyConditionExpression: "#senderAlias = :senderAlias",
//         ExpressionAttributeNames: {
//           "#senderAlias": "senderAlias"
//         },
//         ExpressionAttributeValues: {
//           ":senderAlias": senderAlias
//         }
//       })
//     );

//     const deleteRequests = result.Items?.map((item) => ({
//       DeleteRequest: {
//         Key: {
//           receiverAlias: item.receiverAlias,
//           timestamp: item.timestamp
//         }
//       }
//     })) ?? [];

//     console.log("deleteRequests: ", deleteRequests.length)

//     // send batch write request for every 25 items even if the number of items is less than 25
//     for (let i = 0; i < deleteRequests.length; i += 25) {
//       await client.send(
//         new BatchWriteCommand({
//           RequestItems: {
//             [this.tableName]: deleteRequests.slice(i, i + 25)
//           }
//         })
//       );
//     }


//  }
}