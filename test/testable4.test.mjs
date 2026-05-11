import { afterAll, beforeEach, describe, expect, test } from "vitest";
import argon2 from "@node-rs/argon2";
import { PasswordService, PostgresUserDao, createPool } from "../src/testable4.mjs";

class InMemoryUserDao {
  users = new Map();
  async getById(userId) {
    return this.users.get(userId) ?? null;
  }
  async save(user) {
    this.users.set(user.userId, { ...user });
  }
}

describe("PasswordService (unit, with in-memory DAO)", () => {
  let users;
  let service;

  beforeEach(() => {
    users = new InMemoryUserDao();
    service = new PasswordService(users);
  });

  test("changes the password when the old password is correct", async () => {
    await users.save({ userId: 1, passwordHash: argon2.hashSync("old-pw") });

    await service.changePassword(1, "old-pw", "new-pw");

    const updated = await users.getById(1);
    expect(argon2.verifySync(updated.passwordHash, "new-pw")).toBe(true);
    expect(argon2.verifySync(updated.passwordHash, "old-pw")).toBe(false);
  });

  test("rejects a wrong old password and leaves the hash unchanged", async () => {
    const originalHash = argon2.hashSync("old-pw");
    await users.save({ userId: 1, passwordHash: originalHash });

    await expect(service.changePassword(1, "WRONG", "new-pw")).rejects.toThrow("wrong old password");

    expect((await users.getById(1)).passwordHash).toBe(originalHash);
  });

  test("rejects an unknown user", async () => {
    await expect(service.changePassword(999, "x", "y")).rejects.toThrow("user not found");
  });
});

describe("PostgresUserDao (integration, real database)", () => {
  const pool = createPool();
  const dao = new PostgresUserDao(pool);

  beforeEach(async () => {
    await pool.query("delete from users");
  });

  afterAll(async () => {
    await dao.close();
  });

  test("returns null when the user does not exist", async () => {
    expect(await dao.getById(42)).toBeNull();
  });

  test("saves a new user and reads it back", async () => {
    await dao.save({ userId: 1, passwordHash: "hash-A" });
    expect(await dao.getById(1)).toEqual({ userId: 1, passwordHash: "hash-A" });
  });

  test("save() upserts an existing user's password hash", async () => {
    await dao.save({ userId: 1, passwordHash: "hash-A" });
    await dao.save({ userId: 1, passwordHash: "hash-B" });
    expect(await dao.getById(1)).toEqual({ userId: 1, passwordHash: "hash-B" });
  });
});
