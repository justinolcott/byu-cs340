import { FollowsTableAWSDAO } from "./dynamo/FollowsTableAWSDAO";

// Test Load More Followers
async function test() {
  const FollowService = new FollowsTableAWSDAO();
}


test();

// async function test() {
//   const followsTable = new FollowsTableAWSDAO();
//   console.log(await followsTable.getFollowers("user1"));
//   console.log(await followsTable.getFollowees("user1"));
//   console.log(await followsTable.getFollowersCount("user1"));
//   console.log(await followsTable.getFolloweesCount("user1"));
//   console.log("Adding follow");
//   await followsTable.follow("user1", "user2");
//   console.log("User 1");
//   console.log(await followsTable.getFollowers("user1"));
//   console.log(await followsTable.getFollowees("user1"));
//   console.log(await followsTable.getFollowersCount("user1"));
//   console.log(await followsTable.getFolloweesCount("user1"));

//   console.log("User 2");
//   console.log(await followsTable.getFollowers("user2"));
//   console.log(await followsTable.getFollowees("user2"));


//   console.log("Removing follow");
//   await followsTable.unfollow("user1", "user2");
//   console.log("User 1");
//   console.log(await followsTable.getFollowers("user1"));
//   console.log(await followsTable.getFollowees("user1"));

//   console.log("User 2");
//   console.log(await followsTable.getFollowers("user2"));
//   console.log(await followsTable.getFollowees("user2"));
// }

// test();