import Knex from "knex";

export const up = async (knex: Knex) =>
    knex.schema.createTable("users", table => {
        table.increments("id");
        table
            .string("username")
            .unique()
            .notNullable();
        table
            .string("email")
            .unique()
            .notNullable();
        table.string("password").notNullable();
    });

export const down = async (knex: Knex) => knex.schema.dropTable("users");
