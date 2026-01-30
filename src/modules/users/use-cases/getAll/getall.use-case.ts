import { IUserRepository } from "../../repository/user.admin.repository";

export class GetAllUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    async execute(dto){
        const user = await this.userRepository.getAll(dto)
        return user
    }
}