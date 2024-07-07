import { Inject } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRepository } from "src/user/application/ports/out/user.repository";
import { UserCredentials } from "src/user/domain/user-credentials.model";
import { User } from "src/user/domain/user.model";

export class UserRepositoryImpl implements UserRepository 
{
    public constructor(@Inject(PrismaService) protected prismaService: PrismaService) 
    {}

    public async findBy(values: Object): Promise<Array<User>> 
    {
        const name = values['name'] || '';
        const profileVisibility = values['profileVisibility'] || 'public';

        const userIds = await this.prismaService.$queryRaw<{id: string}[]>`
            SELECT id FROM users 
            WHERE name LIKE '%${name}%' 
            OR profile_visibility = '${profileVisibility}';
        `;

        const users = await this.prismaService.user.findMany({
            where: {id: {in: userIds.map((row) => row.id)}},
            include: {credentials: true}
        });

        return users.map((user) => {
            if(user) {
                return User.create(
                    user.id,
                    user.profile_picture,
                    user.banner_picture,
                    user.biograph,
                    user.birth_date,
                    user.profile_visibility,
                    UserCredentials.create(
                        user.id,
                        user.credentials.name,
                        user.credentials.email,
                        user.credentials.password
                    ),
                    user.created_at,
                    user.updated_at,
                    user.is_deleted
                );
            }else {
                return null;
            }
        });
    }

    public async findAll(): Promise<Array<User>> 
    {
        const users = await this.prismaService.user.findMany({
            include: {
                credentials: true
            }
        });

        if(users.length === 0) return [];

        return users.map((user): User => {
            return User.create(
                user.id,
                user.profile_picture,
                user.banner_picture,
                user.biograph,
                user.birth_date,
                user.profile_visibility,
                UserCredentials.create(
                    user.credentials.user_id,
                    user.credentials.name,
                    user.credentials.email,
                    user.credentials.password
                ),
                user.created_at,
                user.updated_at,
                user.is_deleted
            );
        });
    }

    public async findById(id: string): Promise<User> {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: id
            },
            include: {
                credentials: true
            },
        });

        if(user === null) return null;

        return User.create(
            user.id,
            user.profile_picture,
            user.banner_picture,
            user.biograph,
            user.birth_date,
            user.profile_visibility,
            UserCredentials.create(
                user.credentials.user_id,
                user.credentials.name,
                user.credentials.email,
                user.credentials.password
            ),
            user.created_at,
            user.updated_at,
            user.is_deleted
        );
    }

    public async findByName(name: string): Promise<User> 
    {
        const userCredentials = await this.prismaService.userCredentials.findFirst({
            where: {
                name: name
            },
            include: {
                user: true
            }
        });

        if(userCredentials === null) return null;

        return User.create(
            userCredentials.user.id,
            userCredentials.user.profile_picture,
            userCredentials.user.banner_picture,
            userCredentials.user.biograph,
            userCredentials.user.birth_date,
            userCredentials.user.profile_visibility,
            UserCredentials.create(
                userCredentials.user_id,
                userCredentials.name,
                userCredentials.email,
                userCredentials.password
            ),
            userCredentials.user.created_at,
            userCredentials.user.updated_at,
            userCredentials.user.is_deleted
        );
    }

    public async findByEmail(email: string): Promise<User> 
    {
        const userCredentials = await this.prismaService.userCredentials.findFirst({
            where: {
                email: email
            },
            include: {
                user: true
            }
        });

        if(userCredentials === null) return null;

        return User.create(
            userCredentials.user.id,
            userCredentials.user.profile_picture,
            userCredentials.user.banner_picture,
            userCredentials.user.biograph,
            userCredentials.user.birth_date,
            userCredentials.user.profile_visibility,
            UserCredentials.create(
                userCredentials.user_id,
                userCredentials.name,
                userCredentials.email,
                userCredentials.password
            ),
            userCredentials.user.created_at,
            userCredentials.user.updated_at,
            userCredentials.user.is_deleted
        );
    }

    public async store(model: User): Promise<User> 
    {
        const user = await this.prismaService.user.create({
            data: {
                id: model.id(),
                banner_picture: model.bannerPicture(),
                profile_picture: model.profilePicture(),
                biograph: model.biograph(),
                birth_date: model.birthDate(),
                profile_visibility: model.profileVisibility(),
                is_deleted: model.isDeleted(),
                created_at: model.createdAt(),
                updated_at: model.updatedAt(),
                credentials: {
                    create: {
                        name: model.credentials().name(),
                        email: model.credentials().email(),
                        password: model.credentials().password()
                    }
                }
            },
            include: {
                credentials: true
            }
        });

        if(user === null) return null;

        return User.create(
            user.id,
            user.profile_picture,
            user.banner_picture,
            user.biograph,
            user.birth_date,
            user.profile_visibility,
            UserCredentials.create(
                user.credentials.user_id,
                user.credentials.name,
                user.credentials.email,
                user.credentials.password
            ),
            user.created_at,
            user.updated_at,
            user.is_deleted
        );
    }

    public async update(model: User): Promise<User> 
    {
        const user = await this.prismaService.user.update({
            data: {
                biograph: model.biograph(),
                banner_picture: model.bannerPicture(),
                profile_picture: model.profilePicture(),
                birth_date: model.birthDate(),
                is_deleted: model.isDeleted()
            },
            where: {
                id: model.id()
            },
            include: {
                credentials: true
            }
        });

        if(user === null) return null;

        return User.create(
            user.id,
            user.profile_picture,
            user.banner_picture,
            user.biograph,
            user.birth_date,
            user.profile_visibility,
            UserCredentials.create(
                user.credentials.user_id,
                user.credentials.name,
                user.credentials.email,
                user.credentials.password
            ),
            user.created_at,
            user.updated_at,
            user.is_deleted
        );
    }

    public async updateCredentials(model: UserCredentials): Promise<User> 
    {
        const userCredentials = await this.prismaService.userCredentials.update({
            data: {
                user_id: model.id(),
                email: model.email(),
                name: model.name(),
                password: model.password()
            },
            where: {
                user_id: model.id()
            },
            include: {
                user: true
            }
        });

        if(userCredentials === null) return null;

        return User.create(
            userCredentials.user.id,
            userCredentials.user.profile_picture,
            userCredentials.user.banner_picture,
            userCredentials.user.biograph,
            userCredentials.user.birth_date,
            userCredentials.user.profile_visibility,
            UserCredentials.create(
                userCredentials.user_id,
                userCredentials.name,
                userCredentials.email,
                userCredentials.password
            ),
            userCredentials.user.created_at,
            userCredentials.user.updated_at,
            userCredentials.user.is_deleted
        );
    }

    public async delete(id: string): Promise<void> 
    {
        await this.prismaService.user.delete({
            where: {id: id},
            include: {
                credentials: true,
                addresses: true
            }
        });
    }
}