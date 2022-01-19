import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {OutputBlockData} from "../dto/create-post.dto";
import {UserEntity} from "../../user/entities/user.entity";

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity,{
    eager:true
  })
  user:UserEntity

  @Column({ type: "jsonb"})
  body: OutputBlockData[];

  @Column()
  description:string;

  @Column({
    default: 0,
  })
  views: number;

  @Column({ nullable: true })
  tags?: string;

  @CreateDateColumn({ type: 'timestamp'})
  created: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updated: Date;
}
