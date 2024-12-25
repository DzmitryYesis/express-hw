import "reflect-metadata";
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
import {Container} from "inversify";

export const container = new Container();

//query repositories
container.bind(QueryBlogsRepository).to(QueryBlogsRepository)
container.bind(QueryPostsRepository).to(QueryPostsRepository)
container.bind(QueryCommentsRepository).to(QueryCommentsRepository)
container.bind(QueryDevicesRepository).to(QueryDevicesRepository)
container.bind(QueryUsersRepository).to(QueryUsersRepository)

//repositories
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(LogRequestsRepository).to(LogRequestsRepository)
container.bind(TestingRepository).to(TestingRepository)
container.bind(PasswordRecoveryRepository).to(PasswordRecoveryRepository)
container.bind(SessionsRepository).to(SessionsRepository)
container.bind(UsersRepository).to(UsersRepository)

//services
container.bind(BlogsService).to(BlogsService)
container.bind(PostsService).to(PostsService)
container.bind(CommentsService).to(CommentsService)
container.bind(LogRequestService).to(LogRequestService)
container.bind(UsersService).to(UsersService)

//controllers
container.bind(BlogsController).to(BlogsController)
container.bind(CommentsController).to(CommentsController)
container.bind(TestingController).to(TestingController)
container.bind(PostsController).to(PostsController)
container.bind(AuthController).to(AuthController)
container.bind(SecurityController).to(SecurityController)
container.bind(UsersController).to(UsersController)