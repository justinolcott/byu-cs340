import { AuthTokenTableDAO, DAOFactory, FeedTableDAO, FollowsTableDAO, ProfileImageDAO, StoryTableDAO, UserTableDAO } from "../dao/DAOInterfaces";
import { AuthTokenAWSDAO } from "./dynamo/AuthTokenTableAWSDAO";
import { FollowsTableAWSDAO } from "./dynamo/FollowsTableAWSDAO";
import { StoryTableAWSDAO } from "./dynamo/StoryTableAWSDAO";
import { UserTableAWSDAO } from "./dynamo/UserTableAWSDAO";
import { ProfileImageAWSDAO } from "./s3/ProfileImageAWSDAO";


export class FactoryAWSDAO implements DAOFactory {
  createUserTableDAO(): UserTableDAO {
    return new UserTableAWSDAO();
  }

  createProfileImageDAO(): ProfileImageDAO {
    return new ProfileImageAWSDAO();
  }

  createFeedTableDAO(): FeedTableDAO {
    throw new Error("Method not implemented.");
  }

  createAuthTokenTableDAO(): AuthTokenTableDAO {
    return new AuthTokenAWSDAO();
  }

  createStoryTableDAO(): StoryTableDAO {
    return new StoryTableAWSDAO();
  }

  createFollowsTableDAO(): FollowsTableDAO {
    return new FollowsTableAWSDAO();
  }
}