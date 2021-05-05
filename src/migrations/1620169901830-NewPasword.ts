import { MigrationInterface, QueryRunner } from "typeorm";

export class NewPasword1620169901830 implements MigrationInterface {
  name = "NewPasword1620169901830";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(150)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
  }
}
