import {
    BlogsRepository,
    BlogsService,
    CommentsRepository,
    LogRequestsRepository,
    PostsRepository,
    QueryBlogsRepository,
    QueryCommentsRepository,
    QueryPostsRepository,
    TestingRepository,
    BlogsController,
    QueryDevicesRepository,
    QueryUsersRepository,
    SessionsRepository,
    UsersRepository,
    PasswordRecoveryRepository,
    PostsService,
    CommentsService,
    UsersService,
    CommentsController,
    LogRequestService,
    TestingController,
    PostsController,
    AuthController,
    SecurityController,
    UsersController
} from "./features";

console.log('QueryBlogsRepository: ', QueryBlogsRepository)

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
