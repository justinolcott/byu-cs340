import { AuthToken, FakeData, User } from "tweeter-shared";

import { UserService } from "../model/service/UserService";

import { UserTableAWSDAO } from "./dynamo/UserTableAWSDAO";
import { ProfileImageAWSDAO } from "./s3/ProfileImageAWSDAO";
import { StoryTableAWSDAO } from "./dynamo/StoryTableAWSDAO";
import { StatusService } from "../model/service/StatusService";


// // Clear UserTable
// try {
//   console.log("Clearing UserTable");
//   const userTableDAO = new UserTableAWSDAO();
//   userTableDAO.deleteAllUsers();
// } catch (error) {
//   console.error(`Clearing Tables: ${error}`);
// }

// // Clear S3
// try {
//   console.log("Clearing S3");
//   const profileImageDAO = new ProfileImageAWSDAO();
//   profileImageDAO.deleteAllImages();
// } catch (error) {
//   console.error(`Clearing Tables: ${error}`);
// }

// Clear AuthTokenTable

// Register All Users

console.log("Populating UserTable and S3");


async function RegisterAllUsers() {
  const userService = new UserService();
  const allUsers = FakeData.instance.fakeUsers;
  for (const user of allUsers) {
    console.log(`Putting user ${user.alias}`);

    const imageUrl = user.imageUrl;
    const image = await fetch(imageUrl);
    const imageBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(imageBuffer).toString("base64");

    await userService.register(user.firstName, user.lastName, user.alias, "password", base64String);
    // await new Promise((res) => setTimeout(res, 3000));
  }
}


async function CreateAllStories() {

  const validAuthToken = new AuthToken("valid", Date.now());
  const statusService = new StatusService();

  const allStatuses = FakeData.instance.fakeStatuses;

  for (const status of allStatuses) {
    console.log(`Putting status `, status);
    await statusService.postStatus(validAuthToken, status);
  }

  

}



async function test() {
  // await RegisterAllUsers();
  await CreateAllStories();
  return;
}
test();


// import { UserTableAWSDAO } from "./dynamo/UserTableAWSDAO";
// import { ProfileImageAWSDAO } from "./s3/ProfileImageAWSDAO";


// const userTableDAO = new UserTableAWSDAO();

// // const allUsers = FakeData.instance.fakeUsers;
// // // Populate the UserTable
// // // allUsers.forEach(async (user) => {
// // //   console.log(`Putting user ${user.alias}`);
// // //   await userTableDAO.putUser(user);
// // //   await new Promise((res) => setTimeout(res, 1000));
// // // });


// // // Populate S3
// // const profileImageDAO = new ProfileImageAWSDAO();
// // allUsers.forEach(async (user) => {
// //   console.log(`Putting profile image for ${user.alias}`);
// //   const imageUrl = user.imageUrl;
// //   // get the image
// //   const image = await fetch(imageUrl);

// //   // convert to base64
// //   const imageBuffer = await image.arrayBuffer();
// //   const base64String = Buffer.from(imageBuffer).toString("base64");
// //   await profileImageDAO.putImage(user.alias, base64String);
// // });




