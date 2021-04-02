import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1617404119229 implements MigrationInterface {
    name = 'PostRefactoring1617404119229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(100), "lastName" character varying(100), "googleId" character varying(100), "phone" character varying(100), "email" character varying(120) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
