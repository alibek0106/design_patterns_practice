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

    withRandomData(): UserBuilder {
        this.user.username = faker.internet.username() + faker.number.int({ min: 100, max: 999 });
        this.user.password = faker.internet.password();
        return this;
    }

    setUsername(name: string): UserBuilder {
        this.user.username = name;
        return this;
    }

    setPassword(pass: string): UserBuilder {
        this.user.password = pass;
        return this;
    }

    build(): UserData {
        return this.user;
    }
}