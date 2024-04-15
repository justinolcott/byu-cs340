/**
 * Add a main user
 * Add 10,000 users
 * 
 * Make the main user follow 10,000 users
 * Make the 10,000 users follow the main user
 * 
 * Have the main user post a status
 */

import { User } from "tweeter-shared";
import { Factory } from "./dao/DAOInterfaces";
import { UserService } from "./model/service/UserService";
import { FollowService } from "./model/service/FollowService";


async function main() {
  const mainUser = new User(
    "mainfirstName",
    "mainlastName",
    "mainalias",
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  )

  const users: User[] = [];
  for (let i = 0; i < 10000; i++) {
    users.push(new User(
      "firstName",
      "lastName",
      `alias${i}`,
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    ));
  }

  const userTableDao = Factory.instance().createUserTableDAO();
  const userService = new UserService();
  console.log("registering main user");
  // await userService.register(
  //   mainUser.firstName,
  //   mainUser.lastName,
  //   mainUser.alias,
  //   "password",
  //   mainUser.imageUrl
  // );
  
  // batched put users
  const batchedUsers: User[][] = [];
  for (let i = 0; i < 10000; i += 25) {
    batchedUsers.push(users.slice(i, i + 25));
  }

  // console.log("registering users");
  // for (const batch of batchedUsers) {
  //   console.log("batch");
  //   await userTableDao.batchWriteUsers(batch, 1, 1);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  // }

  // now add follows
  const followsTableDao = Factory.instance().createFollowsTableDAO();
  const followService = new FollowService();

  // main user follows all users
  let mainfollows: {
    followerAlias: string,
    followeeAlias: string
  }[] = [];

  let userfollows: {
    followerAlias: string,
    followeeAlias: string
  }[] = [];

  for (const user of users) {
    mainfollows.push({
      followerAlias: mainUser.alias,
      followeeAlias: user.alias
    });
  }

  for (const user of users) {
    userfollows.push({
      followerAlias: user.alias,
      followeeAlias: mainUser.alias
    });
  }

  const batchedMainFollows: {
    followerAlias: string,
    followeeAlias: string
  }[][] = [];

  const batchedUserFollows: {
    followerAlias: string,
    followeeAlias: string
  }[][] = [];

  // it broke after 4299
  for (let i = 0; i < 10000; i += 25) {
    if (i > 4299) {
      batchedMainFollows.push(mainfollows.slice(i, i + 25));
    }
    batchedUserFollows.push(userfollows.slice(i, i + 25));
  }

  console.log("adding main follows");
  for (const batch of batchedMainFollows) {
    // await followsTableDao.batchWriteFollows(batch);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("adding user follows");
  for (const batch of batchedUserFollows) {
    // await followsTableDao.batchWriteFollows(batch);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main();

/**
 * I have added all the above follows and users
 */