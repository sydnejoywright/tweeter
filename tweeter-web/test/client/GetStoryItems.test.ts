import { StatusService } from "../../src/model.service/StatusService";
import { UserService } from "../../src/model.service/UserService";

import { AuthToken, Status } from "tweeter-shared";
import fetch from "node-fetch";

(global as any).fetch = fetch;

describe("StatusService (integration)", () => {
  let statusService: StatusService;
  let userService: UserService;
  let authToken: AuthToken;

  beforeAll(async () => {
    statusService = new StatusService();
    userService = new UserService();

    const [user, token] = await userService.login(
      "@integrationTestUser",
      "password123"
    );

    authToken = token

  });

  it("retrieves a user's story successfully", async () => {

    const alias = "@someUser";
    const pageSize = 10;

    const [items, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      alias,
      pageSize,
      null,
    );

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeLessThanOrEqual(pageSize);

    if (items.length > 0) {
      expect(items[0]).toBeInstanceOf(Status);
      expect(items[0].user.alias).toBe("@allen");
      expect(items[0].segments).toBeDefined();
      expect(items[0].timestamp).toBeDefined();
    }

    expect(typeof hasMore).toBe("boolean");
  });
});
