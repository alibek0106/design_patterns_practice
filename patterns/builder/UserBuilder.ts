import { faker } from "@faker-js/faker";

export interface UserData {
    username: string;
    password: string;
}

export class UserBuilder {
    private user: UserData;

    constructor() {
        this.user = {
            username: '',
            password: ''
        };
    }

    withRandomData(): this {
        this.user.username = faker.internet.username() + faker.number.int({ min: 100, max: 999 });
        this.user.password = faker.internet.password();
        return this;
    }

    setUsername(name: string): this {
        this.user.username = name;
        return this;
    }

    setPassword(pass: string): this {
        this.user.password = pass;
        return this;
    }

    build(): UserData {
        return this.user;
    }

    static generateRandom(): UserData {
        return new UserBuilder().withRandomData().build();
    }
}