import {BlogsController, BlogsRepository, BlogsService, QueryBlogsRepository} from "./features/blogs";
import {PostsController, PostsRepository, PostsService, QueryPostsRepository} from "./features/posts";
import {CommentsController, CommentsRepository, CommentsService, QueryCommentsRepository} from "./features/comments";
import {
    PasswordRecoveryRepository,
    QueryDevicesRepository,
    QueryUsersRepository,
    SessionsRepository,
    UsersRepository,
    UsersService
} from "./features/users";
import {LogRequestService, LogRequestsRepository} from "./features/logRequests";
import {TestingController, TestingRepository} from "./features/testing";
import {AuthController, SecurityController, UsersController} from "./features/users/controllers";

//query repositories
const queryBlogsRepository = new QueryBlogsRepository();
const queryPostsRepository = new QueryPostsRepository();
const queryCommentsRepository = new QueryCommentsRepository();
const queryDevicesRepository = new QueryDevicesRepository();
const queryUsersRepository = new QueryUsersRepository();

//repositories
const blogsRepository = new BlogsRepository();
const postsRepository = new PostsRepository();
const commentsRepository = new CommentsRepository();
const logRequestRepository = new LogRequestsRepository();
const testingRepository = new TestingRepository();
const passwordRecoveryRepository = new PasswordRecoveryRepository();
const sessionsRepository = new SessionsRepository();
const usersRepository = new UsersRepository();

//services
export const blogsService = new BlogsService(blogsRepository, postsRepository);
const postsService = new PostsService(blogsRepository, postsRepository, usersRepository, commentsRepository);
const commentsService = new CommentsService(commentsRepository);
export const logRequestsService = new LogRequestService(logRequestRepository);
export const usersService = new UsersService(usersRepository, sessionsRepository, passwordRecoveryRepository);

//controllers
export const blogsController = new BlogsController(blogsService, queryBlogsRepository, queryPostsRepository);
export const commentsController = new CommentsController(queryCommentsRepository, commentsService);
export const testingController = new TestingController(testingRepository);
export const postsController = new PostsController(queryPostsRepository, postsService, queryCommentsRepository);
export const authController = new AuthController(usersService, queryUsersRepository);
export const securityController = new SecurityController(queryDevicesRepository, usersService);
export const usersController = new UsersController(queryUsersRepository, usersService);
