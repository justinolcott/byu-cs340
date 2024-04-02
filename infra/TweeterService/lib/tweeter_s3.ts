// import * as cdk from "aws-cdk-lib";
// import { Construct } from "constructs";


// export class TweeterS3 extends Construct {
//   constructor(scope: Construct, id: string) {
//     super(scope, id);

//     // s3 bucket for user profile images
//     /*
//     Error: s3 put image failed with: AccessControlListNotSupported: The bucket does not allow ACLs
//     */
    

//     const userProfileImagesBucket = new cdk.aws_s3.Bucket(this, "UserProfileImagesBucket", {
//       bucketName: "tweeter-user-profile-images-bucket-justino",
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
//       accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
//     });

//     userProfileImagesBucket.grantReadWrite(

//     )

//     // const userProfileImagesBucketPolicy = new cdk.aws_s3.BucketPolicy(this, "UserProfileImagesBucketPolicy", {
//     //   bucket: userProfileImagesBucket,
      
//     // }); 
//   }
// }