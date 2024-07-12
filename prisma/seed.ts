import { PrismaClient } from "@prisma/client";
import * as groupRoleSeeder from "./seeders/group-role.seeder";


export function seed() 
{
    const prismaClient = new PrismaClient();

    groupRoleSeeder.seed(prismaClient);
}

seed();