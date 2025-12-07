import { S3Dao } from "../../dao/DaoClasses/S3Dao";
import { DynamoUserDao } from "../../dao/DaoClasses/DynamoUserDao";
import DynamoAuthDao from "../../dao/DaoClasses/DynamoAuthDao";
import { DynamoFollowDao } from "../../dao/DaoClasses/DyanmoFollowDao";
import UserService from "../UserService";
import FollowService from "../FollowService";
import { DynamoStatusDao } from "../../dao/DaoClasses/DynamoStatusDao";
import { StatusService } from "../StatusService";
import { AuthorizationService } from "./AuthorizationService";

const S3_BUCKET = process.env.S3_BUCKET!;
const USERS_TABLE = process.env.USERS_TABLE!;
const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;
const FOLLOW_TABLE = process.env.FOLLOW_TABLE!;
const STATUS_TABLE = process.env.STATUS_TABLE!;

const imageDao = new S3Dao(S3_BUCKET);
const userDao = new DynamoUserDao(USERS_TABLE, imageDao);
const authDao = new DynamoAuthDao(SESSIONS_TABLE);
const followDao = new DynamoFollowDao(FOLLOW_TABLE);
const statusDao = new DynamoStatusDao(STATUS_TABLE);

export const userService = new UserService(userDao, imageDao, authDao);
export const followService = new FollowService(userDao, followDao);
export const statusService = new StatusService(
  userDao,
  followDao,
  authDao,
  statusDao
);
export const authService = new AuthorizationService(authDao, userDao);
