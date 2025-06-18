import {
    Column,
    Model,
    Table,
    DataType,
    PrimaryKey,
    BelongsToMany,
} from 'sequelize-typescript';
import { IsNotEmpty } from 'class-validator';
import { Section } from './section.model';
import { JoinSectionSkills } from './JointableSectionSkill.model';


@Table({
    tableName: 'skills',
    timestamps: true,
})
export class Skills extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    @IsNotEmpty()
    declare description: string;


    @BelongsToMany(() => Section, () => JoinSectionSkills)
    section: Section[]
}
