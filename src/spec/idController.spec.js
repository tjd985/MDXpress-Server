const request = require("supertest");

const mongoose = require("mongoose");
const server = require("../../app");
const { setupDB } = require("./testSetup");
const CONSTANTS = require("../constants/constants");

const TemporaryUser = require("../models/TemporaryUser");
const Version = require("../models/Version");

jest.mock("../models/TemporaryUser");
jest.mock("../models/Version");

setupDB();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("idController 테스트", () => {
  describe("[GET] /id/first/version/first", () => {
    it("id와 version값이 first일 경우에는 보일러 플레이트를 제공해야 합니다.", async () => {
      const response = await request(server).get("/id/first/version/first");

      expect(response.statusCode).toEqual(200);
      expect(response.body.content.targetCode).toEqual(
        CONSTANTS.BOILER_PLATE_CODE,
      );
    });
  });

  describe("[GET] /id/InvalidValue/version/InvalidValue", () => {
    it("id값이 ObjectId형식이 아닐 경우 에러응답을 보내주어야 합니다.", async () => {
      const response = await request(server).get(
        "/id/InvalidValue/version/InvalidValue",
      );

      expect(response.body.result).toEqual("Error");
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toEqual("Bad Request");
    });
  });

  describe("[GET] /id/65fe778af093b89c8a25922c/version/0", () => {
    it("유효한 id값이 들어왔을 경우에 DB에 저장되어져 있는 값을 보내주어야 합니다.", async () => {
      const mockUserId = "65fe778af093b89c8a25922c";
      const mockExec = jest.fn();
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      mongoose.isValidObjectId = jest.fn(() => true);

      mockExec.mockImplementation(() => {
        return Promise.resolve({
          versions: [
            {
              _id: "65fe778af093b89c8a25922a",
              version: 0,
              code: "savedCode",
              packageList: [],
            },
          ],
        });
      });

      TemporaryUser.findById.mockReturnValue({
        populate: mockPopulate,
      });

      const response = await request(server).get(`/id/${mockUserId}/version/0`);

      expect(response.body.result).toEqual("OK");
      expect(response.body.status).toEqual(200);
      expect(response.body.content.targetCode).toEqual("savedCode");
    });
  });

  describe("[POST] /id/first", () => {
    it("first 아이디값으로 요청이 들어왔을 경우에 새로운 temporaryUser를 생성하여 응답해야 합니다.", async () => {
      const mockId = "first";
      const mockCode = "firstCode";
      const mockPackageName = "nanoid";

      Version.create.mockResolvedValue({
        version: 0,
        code: mockCode,
        packageList: { [mockPackageName]: "5.6.0" },
        _id: "testUserCodeId",
        __v: 0,
      });

      TemporaryUser.create.mockResolvedValue({
        versions: ["testUserCodeId"],
        _id: "testUserId",
        __v: 0,
      });

      const response = await request(server)
        .post(`/id/${mockId}`)
        .send({
          code: mockCode,
          packageList: { [mockPackageName]: "5.0.6" },
        });

      expect(response.body.result).toEqual("OK");
      expect(response.body.status).toEqual(200);
      expect(response.body.content.latestVersion.version).toEqual(0);
      expect(response.body.content.latestVersion.code).toEqual(mockCode);
      expect(response.body.content.temporaryUser._id).toEqual("testUserId");
    });
  });

  describe("[POST] /id/65fe778af093b89c8a25922c", () => {
    it("유효한 아이디 값으로 들어올 경우 버전을 새로 생성하여 응답해야 합니다.", async () => {
      const mockId = "65fe778af093b89c8a25922c";
      const mockCode = "editedCode";
      const mockExec = jest.fn();
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      TemporaryUser.findById.mockReturnValue({
        populate: mockPopulate,
        versions: [],
        save: () => {},
      });

      Version.create.mockResolvedValue({
        version: 1,
        code: mockCode,
        packageList: {},
        _id: mockId,
      });

      mockExec.mockImplementation(() => {
        return Promise.resolve({
          _id: mockId,
          versions: [
            {
              _id: "testVersionId",
              version: 0,
              code: mockCode,
              packageList: [{}],
              __v: 0,
            },
          ],
        });
      });

      const response = await request(server).post(`/id/${mockId}`).send({
        code: mockCode,
        packageList: {},
      });

      expect(response.body.result).toEqual("OK");
      expect(response.body.status).toEqual(200);
      expect(response.body.content.latestVersion.version).toEqual(1);
      expect(response.body.content.latestVersion.code).toEqual(mockCode);
    });
  });
});
