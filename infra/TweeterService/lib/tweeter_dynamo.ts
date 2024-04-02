import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
// import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import path = require("path");

// const lambda_dir = "../../tweeter-server/dist/lambda";
const lambda_dir = "../../tweeter-server/src/lambda/";

export class TweeterDynamo extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

//     const userTable = new dynamodb.TableV2(this, "UserTable", {
//       partitionKey: { name: "alias", type: dynamodb.AttributeType.STRING },
//       tableName: "UserTable",
//       billing: dynamodb.Billing.provisioned(
//         {
//           readCapacity: dynamodb.Capacity.fixed(1),
//           writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
//         }
//       ),
//     });

//     const feedTable = new dynamodb.TableV2(this, "FeedTable", {
//       partitionKey: { name: "receiverAlias", type: dynamodb.AttributeType.STRING },
//       sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
//       tableName: "FeedTable",
//       billing: dynamodb.Billing.provisioned(
//         {
//           readCapacity: dynamodb.Capacity.fixed(1),
//           writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
//         }
//       )
//     });

//     const storyTable = new dynamodb.TableV2(this, "StoryTable", {
//       partitionKey: { name: "senderAlias", type: dynamodb.AttributeType.STRING },
//       sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
//       tableName: "StoryTable",
//       billing: dynamodb.Billing.provisioned(
//         {
//           readCapacity: dynamodb.Capacity.fixed(1),
//           writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
//         }
//       )
//     });

//     /*
// Create a table named “follows”.
// Partition Key: a string named “follower_handle”. This attribute stores the Twitter handle of the user who is following another user.
// Sort Key: a string named “followee_handle”. This attribute stores the Twitter handle of the user who is being followed.
// This Primary Key lets you query the table by “follower_handle” and sort the results by “followee_handle”.
// Under 'Table Settings' click 'Customize settings'.
// Adjust read & write capacities by turning autoscaling off for each and entering in the desired provisioned capacity units.  These control how fast Dynamo can read/write data to/from your table (you may need to re-adjust these for the project).
// Under 'Secondary indexes' click 'create global index'.
// Index Partition Key: a string named “followee_handle. This is the same “followee_handle” attribute you created in the previous step.
// Index Sort Key: a string named “follower_handle”. This is the same “follower_handle” attribute you created in the previous step.
// This Primary Key lets you query the index by “followee_handle” and sort the results by “follower_handle”.
// Set the index name to “follows_index”.
// For “Projected attributes”, keep the “All” setting.
// Click 'Create table' at the bottom of the page.
//     */

//     const followsTable = new dynamodb.TableV2(this, "FollowersTable", {
//       partitionKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
//       sortKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
//       tableName: "FollowersTable",
//       globalSecondaryIndexes: [
//         {
//           indexName: "FollowsIndex",
//           partitionKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
//           sortKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
//         },
//       ],
//       billing: dynamodb.Billing.provisioned(
//         {
//           readCapacity: dynamodb.Capacity.fixed(1),
//           writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
//         }
//       )
//     });

//     const authTokenTable = new dynamodb.TableV2(this, "AuthTokenTable", {
//       partitionKey: { name: "token", type: dynamodb.AttributeType.STRING },
//       tableName: "AuthTokenTable",
//       billing: dynamodb.Billing.provisioned(
//         {
//           readCapacity: dynamodb.Capacity.fixed(1),
//           writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
//         }
//       )
//     });
  }
}