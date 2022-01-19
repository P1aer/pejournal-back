import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import {CommentEntity} from "../../comment/entities/comment.entity";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    eager: false,
    nullable: true,
  })
  comments: CommentEntity[];


  @CreateDateColumn({ type: 'timestamp'})
  created: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updated: Date;
}
