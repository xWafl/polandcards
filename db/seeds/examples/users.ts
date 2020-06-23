interface User {
    username: string;
    email: string;
    password: string;
}

export default [
    {
        username: "Test1",
        email: "Test1@fake.com",
        password: "Test1pass"
    },
    {
        username: "Test2",
        email: "Test2@fake.com",
        password: "Test2pass"
    },
    {
        username: "Test3",
        email: "Test3@fake.com",
        password: "Test3pass"
    }
] as readonly User[];
