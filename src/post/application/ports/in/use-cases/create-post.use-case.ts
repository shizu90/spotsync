import { UseCase } from "src/common/common.use-case";
import { CreatePostCommand } from "../commands/create-post.command";
import { CreatePostDto } from "../../out/dto/create-post.dto";

export const CreatePostUseCaseProvider = "CreatePostUseCase";

export interface CreatePostUseCase extends UseCase<CreatePostCommand, Promise<CreatePostDto>> 
{}