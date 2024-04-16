import { DynamoDB, ScanCommand, 
} from "@aws-sdk/client-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";


const tableName = "FeedTable";

async function clearTable(): Promise<void> {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const command = new ScanCommand({
    TableName: tableName,
  });
  console.log("Scanning for items in table");
  const results = await client.send(command);
  const items = results.Items;
  console.log("Items found: ", items?.length);
  console.log("Item 0: ", items?.[0]);

  const client2 = new DynamoDBClient({ region: "us-east-1" });

  let deleteRequests: any = [];
  for (const item of items!) {
    const deleteRequest = { 
      TableName: tableName,
      Key: {
        receiverAlias: item.receiverAlias.S,
        timestamp: Number(item.timestamp.N),
      }
    }
    deleteRequests.push({ DeleteRequest: deleteRequest });
  }

  console.log("deleteRequests: ", deleteRequests!.length);
  console.log("deleteRequests 0: ", deleteRequests![0]);
  // send batch write request for every 25 items even if the number of items is less than 25
  try {
    for (let i = 0; i < deleteRequests!.length; i += 25) {
      if (i % 100 === 0) console.log("Deleting items: ", i, " to ", i + 25);
      await client2.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: deleteRequests!.slice(i, i + 25),
          },
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    console.log("Table cleared");
  } catch (error) {
    console.error("Error deleting items: ", error);
  }
}

clearTable();