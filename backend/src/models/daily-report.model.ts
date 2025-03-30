import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DailyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  totalBuzz: number;

  @Column({ type: 'int', default: 0 })
  companyPositive: number;

  @Column({ type: 'int', default: 0 })
  companyNegative: number;

  @Column({ type: 'int', default: 0 })
  companyInquiry: number;

  @Column({ type: 'int', default: 0 })
  competitorPositive: number;

  @Column({ type: 'int', default: 0 })
  competitorNegative: number;

  @Column({ type: 'int', default: 0 })
  competitorInquiry: number;

  @Column({ type: 'json', nullable: true })
  keywordFrequency: any;

  @CreateDateColumn()
  createdAt: Date;
}