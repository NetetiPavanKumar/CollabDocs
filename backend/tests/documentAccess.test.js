const request = require("supertest");

const app = require("../src/app");

const Document = require("../src/models/Document");
const User = require("../src/models/User");

jest.mock("../src/models/Document");
jest.mock("../src/models/User");

describe("Document access control", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should deny access when user is not the owner or a shared user", async () => {
    const pavanId = "507f1f77bcf86cd799439011";
    const bobId = "507f1f77bcf86cd799439012";
    const documentId = "507f1f77bcf86cd799439013";

    Document.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis()
    });

    const populatedDocument = {
      _id: documentId,
      title: "Private Document",

      owner: {
        _id: pavanId,
        name: "Pavan Kumar Neteti",
        email: "pavankumarneteti717@gmail.com"
      },

      sharedWith: []
    };

    Document.findById.mockReturnValueOnce({
      populate: jest
        .fn()
        .mockReturnValueOnce({
          populate: jest
            .fn()
            .mockResolvedValue(
              populatedDocument
            )
        })
    });

    const response = await request(app)
      .get(`/api/documents/${documentId}`)
      .query({
        userId: bobId
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message:
        "You do not have access to this document"
    });
  });
});