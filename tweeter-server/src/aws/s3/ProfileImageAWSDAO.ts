import { ProfileImageDAO } from "../../dao/DAOInterfaces";
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsCommand,
  CopyObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
  DeleteBucketCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

/*
 stores profile images in an S3 bucket
*/

const BUCKET = "tweeter-user-profile-images-bucket-cs340-v1";
const REGION = "us-east-1";

export class ProfileImageAWSDAO implements ProfileImageDAO {
  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );

    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      // ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return (
      `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`
      );
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }

  async deleteImage(fileName: string): Promise<void> {
    const c = new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: [
          {
            Key: "image/" + fileName,
          },
        ],
      },
    
    });
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
    } catch (error) {
      throw Error("s3 delete image failed with: " + error);
    }
  }

  async getImage(fileName: string): Promise<string> {
    const c = new GetObjectCommand({
      Bucket: BUCKET,
      Key: "image/" + fileName,
    });
    const client = new S3Client({ region: REGION });
    try {
      const response = await client.send(c);
      if (response.Body) {
        return response.Body.toString();
      } else {
        throw Error("s3 get image failed: response body is undefined");
      }
    } catch (error) {
      throw Error("s3 get image failed with: " + error);
    }
  }

  async deleteAllImages(): Promise<void> {
    const client = new S3Client({ region: REGION });
    const listParams = {
      Bucket: BUCKET,
    };
    const listCommand = new ListObjectsCommand(listParams);
    try {
      const listResponse = await client.send(listCommand);
      const objects = listResponse.Contents;
      if (objects) {
        const deleteParams = {
          Bucket: BUCKET,
          Delete: {
            Objects: objects.map((object) => {
              return { Key: object.Key };
            }),
          },
        };
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await client.send(deleteCommand);
      }
    } catch (error) {
      throw Error("s3 delete all images failed with: " + error);
    }
  }
}