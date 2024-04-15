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

import { User } from "tweeter-shared";
import { UserTableDAO } from "../../dao/DAOInterfaces";


/*
const userProfileImagesBucket = new cdk.aws_s3.Bucket(this, "UserProfileImagesBucket", {
      bucketName: "tweeter-user-profile-images-bucket-justino",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    }); 

    const userTable = new dynamodb.TableV2(this, "UserTable", {
      partitionKey: { name: "alias", type: dynamodb.AttributeType.STRING },
      tableName: "UserTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      ),
    });
*/

export class UserTableAWSDAO implements UserTableDAO {
  readonly tableName: string = "UserTable";
  // readonly partitionKey: string = "alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


  async putUser(
    user: User,
    hash: string,
    followersCount: number,
    followeesCount: number
    ): Promise<void> {
    const userDto = user.dto;
    const userItem = {
      ...userDto,
      hash: hash,
      followersCount: followersCount,
      followeesCount: followeesCount
    }

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: userItem,
      })
    );
  }

  async getFollowersCount(alias: string): Promise<number> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
        ProjectionExpression: "followersCount",
      })
    );

    const userItem = response.Item;
    if (!userItem) {
      return 0;
    }

    return userItem.followersCount;
  }

  async getFolloweesCount(alias: string): Promise<number> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
        ProjectionExpression: "followeesCount",
      })
    );

    const userItem = response.Item;
    if (!userItem) {
      return 0;
    }

    return userItem.followeesCount;
  }


  /**
   * 
   * @param alias 
   * @returns followersCount, followeesCount
   */
  async getFollowCount(alias: string): Promise<[number, number]> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
        ProjectionExpression: "followersCount, followeesCount",
      })
    );

    const userItem = response.Item;
    if (!userItem) {
      return [0, 0];
    }

    return [userItem.followersCount, userItem.followeesCount];
  }

  async incrementFollowersCount(alias: string): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
        UpdateExpression: "SET followersCount = followersCount + :inc",
        ExpressionAttributeValues: {
          ":inc": 1,
        },
      })
    );
  }

  async decrementFollowersCount(alias: string): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
        UpdateExpression: "SET followersCount = followersCount - :dec",
        ExpressionAttributeValues: {
          ":dec": 1,
        },
      })
    );
  }

  async getUser(alias: string): Promise<User | null> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
      })
    );

    const userItem = response.Item;
    if (!userItem) {
      return null;
    }

    return new User(
      userItem.firstName,
      userItem.lastName,
      userItem.alias,
      userItem.imageUrl
    );
  }

  async getHash(alias: string): Promise<string | null> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
      })
    );

    const userItem = response.Item;
    if (!userItem) {
      return null;
    }

    return userItem.hash;
  }

  
  
  async deleteUser(alias: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
      })
    );
  }

  async deleteAllUsers(): Promise<void> {
    const response = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: {
          ":alias": { S: "alias" },
        },
      })
    );

    const users = response.Items;
    if (!users) {
      return;
    }

    for (const user of users) {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: {
            alias: user.alias,
          },
        })
      );
    }
  }

  async batchWriteUsers(users: User[], followersCount: number, followeesCount: number): Promise<void> {
    const putRequests = users.map((user) => ({
      PutRequest: {
        Item: {
          ...user.dto,
          hash: "",
          followersCount: followersCount,
          followeesCount: followeesCount,
        }
      },
    }));

    await this.client.send(
      new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: putRequests,
        },
      })
    );
  }
  
}
