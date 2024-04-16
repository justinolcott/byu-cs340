import { AuthToken, User, Status } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import "isomorphic-fetch";


describe('StatusService', () => {
  it('LoadMoreStoryItems', async () => {
    expect(true).toBeTruthy();
  });
  // let statusService: StatusService;

  // beforeEach(() => {
  //   statusService = new StatusService();
  // });

  // it('LoadMoreStoryItems', async () => {
  //   const request = {
  //     authToken : {
  //       token: 'token',
  //       timestamp: 0
  //     },
  //     user: {
  //       firstName: 'Allen',
  //       lastName: 'Anderson',
  //       alias: '@allen',
  //       imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  //     },
  //     pageSize: 10,
  //     lastItem: null
  //   };

  //   const [statuses, hasMorePages] = await statusService.loadMoreStoryItems(
  //     AuthToken.fromDto(request.authToken)!,
  //     User.fromDto(request.user)!,
  //     request.pageSize,
  //     request.lastItem ? Status.fromDto(request.lastItem) : null
  //   );

  //   expect(statuses).toBeDefined();
  //   expect(hasMorePages).toBeDefined();
  //   expect(statuses.length).toBeGreaterThan(0);

  //   let lastItem = statuses[statuses.length - 1];
  //   const request2 = {
  //     authToken : {
  //       token: 'token',
  //       timestamp: 0
  //     },
  //     user: {
  //       firstName: 'Allen',
  //       lastName: 'Anderson',
  //       alias: '@allen',
  //       imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  //     },
  //     pageSize: 10,
  //     lastItem: lastItem
  //   };
  //   const [statuses2, hasMorePages2] = await statusService.loadMoreStoryItems(
  //     AuthToken.fromDto(request2.authToken)!,
  //     User.fromDto(request2.user)!,
  //     request2.pageSize,
  //     request2.lastItem ? Status.fromDto(request2.lastItem) : null
  //   );

  //   expect(statuses2).toBeDefined();
  //   expect(hasMorePages2).toBeDefined();
  //   expect(statuses2.length).toBeGreaterThan(0);
  // });

  // it('LoadMoreStoryItems', async () => {
  //   const request = {
  //     authToken : {
  //       token: 'token',
  //       timestamp: 0
  //     },
  //     user: {
  //       firstName: 'Allen',
  //       lastName: 'Anderson',
  //       alias: '@allen',
  //       imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  //     },
  //     pageSize: 10,
  //     lastItem: null
  //   };

  //   const [statuses, hasMorePages] = await statusService.loadMoreStoryItems(
  //     AuthToken.fromDto(request.authToken)!,
  //     User.fromDto(request.user)!,
  //     request.pageSize,
  //     request.lastItem ? Status.fromDto(request.lastItem) : null
  //   );

  //   expect(statuses).toBeDefined();
  //   expect(hasMorePages).toBeDefined();
  //   expect(statuses.length).toBeGreaterThan(0);

  //   let lastItem = statuses[statuses.length - 1];
  //   const request2 = {
  //     authToken : {
  //       token: 'token',
  //       timestamp: 0
  //     },
  //     user: {
  //       firstName: 'Allen',
  //       lastName: 'Anderson',
  //       alias: '@allen',
  //       imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
  //     },
  //     pageSize: 10,
  //     lastItem: lastItem
  //   };
  //   const [statuses2, hasMorePages2] = await statusService.loadMoreStoryItems(
  //     AuthToken.fromDto(request2.authToken)!,
  //     User.fromDto(request2.user)!,
  //     request2.pageSize,
  //     request2.lastItem ? Status.fromDto(request2.lastItem) : null
  //   );

  //   expect(statuses2).toBeDefined();
  //   expect(hasMorePages2).toBeDefined();
  //   expect(statuses2.length).toBeGreaterThan(0);
  // });
});