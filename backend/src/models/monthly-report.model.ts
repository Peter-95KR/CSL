import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class MonthlyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  month: Date;

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

  @Column({ type: 'int', default: 0 })
  entrepreneurStartupMentions: number;

  @Column({ type: 'int', default: 0 })
  businessClosureMentions: number;

  @Column({ type: 'int', default: 0 })
  businessTypeSwitchMentions: number;

  @Column({ type: 'json', nullable: true })
  keywordFrequency: any;

  @Column({ type: 'json', nullable: true })
  trendAnalysis: any;

  @CreateDateColumn()
  createdAt: Date;
}