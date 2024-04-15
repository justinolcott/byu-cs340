


/**
 * const followsTable = new dynamodb.TableV2(this, "FollowersTable", {
      partitionKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
      tableName: "FollowersTable",
      globalSecondaryIndexes: [
        {
          indexName: "FollowsIndex",
          partitionKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
          sortKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
        },
      ],
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      )
    });
 */
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { FollowsTableDAO } from "../../dao/DAOInterfaces";
import { User } from "tweeter-shared";


export class FollowsTableAWSDAO implements FollowsTableDAO {
  readonly tableName: string = "FollowersTable";
  
  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    console.log(
      
    )
    await client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          followerAlias: followerAlias,
          followeeAlias: followeeAlias,
        }
      })
    );
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    await client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          followerAlias: followerAlias,
          followeeAlias: followeeAlias,
        }
      })
    );
  }


  /**
   * 
   *  const followsTable = new dynamodb.TableV2(this, "FollowersTable", {
      partitionKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
      tableName: "FollowersTable",
      globalSecondaryIndexes: [
        {
          indexName: "FollowsIndex",
          partitionKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
          sortKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
        },
      ],
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      )
    });
   */
  async loadMoreFollowees(alias: string, lastFolloweeAlias: string, pageSize: number): Promise<[string[], boolean]> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const result = await client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "followerAlias = :alias",
        ExpressionAttributeValues: {
          ":alias": alias,
        },
        ExclusiveStartKey: 
          lastFolloweeAlias === "" ? undefined : {
            followerAlias: alias,
            followeeAlias: lastFolloweeAlias,
          },
        Limit: pageSize,
      })
    );
    const users = result.Items?.map((item: any) => item.followeeAlias) ?? [];
    const hasMore = result.LastEvaluatedKey !== undefined;
    return [users, hasMore];
  }

  async loadMoreFollowers(alias: string, lastFollowerAlias: string, pageSize: number): Promise<[string[], boolean]> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const result = await client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "FollowsIndex",
        KeyConditionExpression: "followeeAlias = :alias",
        ExpressionAttributeValues: {
          ":alias": alias,
        },
        ExclusiveStartKey: 
          lastFollowerAlias === "" ? undefined : {
            followeeAlias: alias,
            followerAlias: lastFollowerAlias,
          },
        Limit: pageSize,
      })
    );
    const users = result.Items?.map((item: any) => item.followerAlias) ?? [];
    const hasMore = result.LastEvaluatedKey !== undefined;
    return [users, hasMore];
  }


  // async getFollowers(alias: string): Promise<string[]> {
  //   console.log("alias: ", alias);
  //   const client = DynamoDBDocumentClient.from(new DynamoDBClient());
  //   const result = await client.send(
  //     new QueryCommand({
  //       TableName: this.tableName,
  //       IndexName: "FollowsIndex",
  //       KeyConditionExpression: "followeeAlias = :alias",
  //       ExpressionAttributeValues: {
  //         ":alias": alias,
  //       }
  //     })
  //   );
  //   return result.Items?.map((item: any) => item.followerAlias) ?? [];
  // }

  // async getFollowees(alias: string): Promise<string[]> {
  //   const client = DynamoDBDocumentClient.from(new DynamoDBClient());
  //   const result = await client.send(
  //     new QueryCommand({
  //       TableName: this.tableName,
  //       KeyConditionExpression: "followerAlias = :alias",
  //       ExpressionAttributeValues: {
  //         ":alias": alias,
  //       }
  //     })
  //   );
  //   return result.Items?.map((item: any) => item.followeeAlias) ?? [];
  // }

  // async getFolloweesCount(alias: string): Promise<number> {
  //   const followings = await this.getFollowees(alias);
  //   return followings.length;
  // }

  // async getFollowersCount(alias: string): Promise<number> {
  //   const followers = await this.getFollowers(alias);
  //   return followers.length;
  // }

  async getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const result = await client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          followerAlias: followerAlias,
          followeeAlias: followeeAlias,
        }
      })
    );
    return result.Item !== undefined;
  }

  async batchWriteFollows(follows: {followerAlias: string, followeeAlias: string}[]): Promise<void> {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const putRequests = follows.map((follow) => ({
      PutRequest: {
        Item: follow,
      }
    }));
    await client.send(
      new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: putRequests,
        }
      })
    );
  }
}