import { AuthTokenTableDAO, DAOFactory, FeedTableDAO, FollowsTableDAO, ProfileImageDAO, SQSPostStatusDAO, SQSUpdateFeedDAO, StoryTableDAO, UserTableDAO } from "../dao/DAOInterfaces";
import { AuthTokenAWSDAO } from "./dynamo/AuthTokenTableAWSDAO";
import { FeedTableAWSDAO } from "./dynamo/FeedTableAWSDAO";
import { FollowsTableAWSDAO } from "./dynamo/FollowsTableAWSDAO";
import { StoryTableAWSDAO } from "./dynamo/StoryTableAWSDAO";
import { UserTableAWSDAO } from "./dynamo/UserTableAWSDAO";
import { ProfileImageAWSDAO } from "./s3/ProfileImageAWSDAO";
import { PostStatusQueueAWSDAO } from "./sqs/PostStatusQueueAWSDAO";
import { UpdateFeedQueueAWSDAO } from "./sqs/UpdateFeedQueueAWSDAO";


export class FactoryAWSDAO implements DAOFactory {
  createUserTableDAO(): UserTableDAO {
    return new UserTableAWSDAO();
  }

  createProfileImageDAO(): ProfileImageDAO {
    return new ProfileImageAWSDAO();
  }

  createFeedTableDAO(): FeedTableDAO {
    return new FeedTableAWSDAO();
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

  createPostStatusQueueDAO(): SQSPostStatusDAO {
    return new PostStatusQueueAWSDAO();
  }

  createUpdateFeedQueueDAO(): SQSUpdateFeedDAO {
    return new UpdateFeedQueueAWSDAO();
  }
}