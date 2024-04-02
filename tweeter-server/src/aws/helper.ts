import { FollowsTableAWSDAO } from "./dynamo/FollowsTableAWSDAO";
import { handler } from "../lambda/LoadMoreStoryItemsLambda";
import { StoryTableAWSDAO} from "./dynamo/StoryTableAWSDAO";
import { TweeterRequestFactory } from "tweeter-shared";

async function test() {
  // const storyTable = new StoryTableAWSDAO();
  // const [statuses, hasMore] = await storyTable.loadMoreStories("@dee", null);
  // console.log(statuses);
  // console.log(hasMore);
  const response = await handler(TweeterRequestFactory.createLoadMoreStatusesRequest(
    {
      token: "token",
      timestamp: Date.now()
    },
    {
      alias: "@dee",
      firstName: "Dee",
      lastName: "Dee",
      imageUrl: "url"
    },
    5,
    null
  ));

  // console.log("Response");
  // console.log(response);
}

test();

// Test Load More Followers
// async function test() {
//   const FollowService = new FollowsTableAWSDAO();
// }


// test();

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