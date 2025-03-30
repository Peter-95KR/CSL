import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.model';
import { DailyReport } from '../models/daily-report.model';
import { WeeklyReport } from '../models/weekly-report.model';
import { MonthlyReport } from '../models/monthly-report.model';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  console.log('Seeding database...');
  try {
    // 1. Seed a default user
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email: 'admin@example.com' } });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = userRepository.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      await userRepository.save(user);
      console.log('Admin user created');
    }

    // 2. Generate date range for the past 30 days
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date;
    });

    // 3. Seed daily reports
    const dailyReportRepository = AppDataSource.getRepository(DailyReport);
    const existingDailyReports = await dailyReportRepository.count();
    
    if (existingDailyReports === 0) {
      const dailyReports = dates.map(date => {
        const buzzBase = Math.floor(Math.random() * 1000) + 500;
        const positiveFactor = Math.random() * 0.4 + 0.3;  // 30-70% positive
        const negativeFactor = Math.random() * 0.3 + 0.1;  // 10-40% negative
        const inquiryFactor = 1 - positiveFactor - negativeFactor;  // remaining as inquiry

        const keywordFrequency: Record<string, number> = {
          '제품': Math.floor(Math.random() * 50) + 20,
          '서비스': Math.floor(Math.random() * 40) + 10,
          '가격': Math.floor(Math.random() * 30) + 10,
          '품질': Math.floor(Math.random() * 25) + 15,
          '배송': Math.floor(Math.random() * 35) + 5,
          '고객센터': Math.floor(Math.random() * 20) + 5,
          '불만': Math.floor(Math.random() * 15) + 5,
          '만족': Math.floor(Math.random() * 25) + 15,
          '추천': Math.floor(Math.random() * 20) + 10,
          '후기': Math.floor(Math.random() * 30) + 20,
        };
        
        // Add some trending keywords with date patterns
        const dayOfMonth = date.getDate();
        if (dayOfMonth % 5 === 0) {
          keywordFrequency['프로모션'] = Math.floor(Math.random() * 60) + 40;
        }
        if (dayOfMonth % 7 === 0) {
          keywordFrequency['신제품'] = Math.floor(Math.random() * 80) + 30;
        }
        
        return dailyReportRepository.create({
          date,
          totalBuzz: buzzBase,
          companyPositive: Math.floor(buzzBase * positiveFactor),
          companyNegative: Math.floor(buzzBase * negativeFactor),
          companyInquiry: Math.floor(buzzBase * inquiryFactor),
          competitorPositive: Math.floor(buzzBase * positiveFactor * 0.7),
          competitorNegative: Math.floor(buzzBase * negativeFactor * 1.2),
          competitorInquiry: Math.floor(buzzBase * inquiryFactor * 0.9),
          keywordFrequency,
        });
      });
      
      await dailyReportRepository.save(dailyReports);
      console.log(`${dailyReports.length} daily reports created`);
    }

    // 4. Seed weekly reports
    const weeklyReportRepository = AppDataSource.getRepository(WeeklyReport);
    const existingWeeklyReports = await weeklyReportRepository.count();
    
    if (existingWeeklyReports === 0) {
      // Generate 8 weeks of data
      const weeklyReports = Array.from({ length: 8 }, (_, i) => {
        const endDate = new Date();
        endDate.setDate(today.getDate() - (i * 7));
        
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        
        const buzzBase = Math.floor(Math.random() * 5000) + 3000;
        const positiveFactor = Math.random() * 0.4 + 0.3;
        const negativeFactor = Math.random() * 0.3 + 0.1;
        const inquiryFactor = 1 - positiveFactor - negativeFactor;
        
        const entrepreneurFactor = Math.random() * 0.1 + 0.05;
        const closureFactor = Math.random() * 0.05 + 0.02;
        const switchFactor = Math.random() * 0.04 + 0.01;
        
        const keywordFrequency: Record<string, number> = {
          '제품': Math.floor(Math.random() * 300) + 100,
          '서비스': Math.floor(Math.random() * 250) + 80,
          '가격': Math.floor(Math.random() * 200) + 100,
          '품질': Math.floor(Math.random() * 180) + 120,
          '배송': Math.floor(Math.random() * 150) + 50,
          '고객센터': Math.floor(Math.random() * 100) + 50,
          '불만': Math.floor(Math.random() * 80) + 40,
          '만족': Math.floor(Math.random() * 120) + 100,
          '추천': Math.floor(Math.random() * 150) + 80,
          '후기': Math.floor(Math.random() * 200) + 120,
          '창업': Math.floor(Math.random() * 50) + 30,
          '폐업': Math.floor(Math.random() * 30) + 10,
          '업종변경': Math.floor(Math.random() * 20) + 5,
          '시장': Math.floor(Math.random() * 70) + 40,
          '트렌드': Math.floor(Math.random() * 90) + 60,
          '경쟁사': Math.floor(Math.random() * 120) + 80,
        };
        
        // Add trend data
        const trendAnalysis = {
          topics: ['제품 품질', '가격 경쟁력', '서비스 만족도', '시장 점유율', '소비자 행동 변화'],
          sentiments: {
            '제품 품질': Math.random() * 100,
            '가격 경쟁력': Math.random() * 100,
            '서비스 만족도': Math.random() * 100,
            '시장 점유율': Math.random() * 100,
            '소비자 행동 변화': Math.random() * 100,
          },
          insights: [
            '소비자들이 제품 품질에 더 민감해지는 추세가 관찰됩니다.',
            '가격 대비 성능을 중요시하는 소비자가 증가하고 있습니다.',
            '온라인 구매 경험이 전반적인 브랜드 인식에 큰 영향을 미칩니다.',
            '경쟁사 대비 고객 서비스 만족도가 상승하는 추세입니다.',
            '지속가능성과 환경친화적 이미지가 브랜드 선호도에 영향을 주고 있습니다.'
          ]
        };
        
        return weeklyReportRepository.create({
          startDate,
          endDate,
          totalBuzz: buzzBase,
          companyPositive: Math.floor(buzzBase * positiveFactor),
          companyNegative: Math.floor(buzzBase * negativeFactor),
          companyInquiry: Math.floor(buzzBase * inquiryFactor),
          competitorPositive: Math.floor(buzzBase * positiveFactor * 0.7),
          competitorNegative: Math.floor(buzzBase * negativeFactor * 1.2),
          competitorInquiry: Math.floor(buzzBase * inquiryFactor * 0.9),
          entrepreneurStartupMentions: Math.floor(buzzBase * entrepreneurFactor),
          businessClosureMentions: Math.floor(buzzBase * closureFactor),
          businessTypeSwitchMentions: Math.floor(buzzBase * switchFactor),
          keywordFrequency,
          trendAnalysis,
        });
      });
      
      await weeklyReportRepository.save(weeklyReports);
      console.log(`${weeklyReports.length} weekly reports created`);
    }
    
    // 5. Seed monthly reports
    const monthlyReportRepository = AppDataSource.getRepository(MonthlyReport);
    const existingMonthlyReports = await monthlyReportRepository.count();
    
    if (existingMonthlyReports === 0) {
      // Generate 12 months of data
      const monthlyReports = Array.from({ length: 12 }, (_, i) => {
        const month = new Date();
        month.setMonth(today.getMonth() - i);
        month.setDate(1); // First day of month
        
        const buzzBase = Math.floor(Math.random() * 20000) + 10000;
        const positiveFactor = Math.random() * 0.4 + 0.3;
        const negativeFactor = Math.random() * 0.3 + 0.1;
        const inquiryFactor = 1 - positiveFactor - negativeFactor;
        
        const entrepreneurFactor = Math.random() * 0.1 + 0.05;
        const closureFactor = Math.random() * 0.05 + 0.02;
        const switchFactor = Math.random() * 0.04 + 0.01;
        
        // More comprehensive keyword data for monthly reports
        const keywordFrequency: Record<string, number> = {
          '제품': Math.floor(Math.random() * 1000) + 500,
          '서비스': Math.floor(Math.random() * 900) + 400,
          '가격': Math.floor(Math.random() * 800) + 300,
          '품질': Math.floor(Math.random() * 750) + 400,
          '배송': Math.floor(Math.random() * 600) + 200,
          '고객센터': Math.floor(Math.random() * 500) + 200,
          '불만': Math.floor(Math.random() * 400) + 150,
          '만족': Math.floor(Math.random() * 700) + 300,
          '추천': Math.floor(Math.random() * 600) + 250,
          '후기': Math.floor(Math.random() * 800) + 350,
          '창업': Math.floor(Math.random() * 300) + 100,
          '폐업': Math.floor(Math.random() * 200) + 50,
          '업종변경': Math.floor(Math.random() * 150) + 30,
          '시장': Math.floor(Math.random() * 400) + 150,
          '트렌드': Math.floor(Math.random() * 500) + 200,
          '경쟁사': Math.floor(Math.random() * 600) + 250,
          '소비자': Math.floor(Math.random() * 550) + 200,
          '마케팅': Math.floor(Math.random() * 450) + 150,
          '프로모션': Math.floor(Math.random() * 400) + 100,
          '할인': Math.floor(Math.random() * 350) + 100,
          '이벤트': Math.floor(Math.random() * 300) + 100,
          '신제품': Math.floor(Math.random() * 400) + 200,
        };
        
        // Monthly market trends
        const trendAnalysis = {
          topics: ['시장 동향', '소비자 행동', '경쟁사 활동', '산업 변화', '기술 혁신'],
          sentiments: {
            '시장 동향': Math.random() * 100,
            '소비자 행동': Math.random() * 100,
            '경쟁사 활동': Math.random() * 100,
            '산업 변화': Math.random() * 100,
            '기술 혁신': Math.random() * 100,
          },
          insights: [
            '소상공인 창업률이 전월 대비 5% 상승했습니다.',
            '식품 업종의 폐업률이 감소하는 추세를 보입니다.',
            '온라인 유통 채널로의 업종 전환이 증가하고 있습니다.',
            '소비자들의 친환경 제품에 대한 관심이 증가하고 있습니다.',
            '경쟁사들의 마케팅 전략이 디지털 채널에 집중되고 있습니다.',
            '새로운 배송 서비스 도입이 고객 만족도에 긍정적 영향을 미치고 있습니다.',
            '소비자 리뷰와 평가가 구매 결정에 미치는 영향력이 증가하고 있습니다.'
          ]
        };
        
        return monthlyReportRepository.create({
          month,
          totalBuzz: buzzBase,
          companyPositive: Math.floor(buzzBase * positiveFactor),
          companyNegative: Math.floor(buzzBase * negativeFactor),
          companyInquiry: Math.floor(buzzBase * inquiryFactor),
          competitorPositive: Math.floor(buzzBase * positiveFactor * 0.7),
          competitorNegative: Math.floor(buzzBase * negativeFactor * 1.2),
          competitorInquiry: Math.floor(buzzBase * inquiryFactor * 0.9),
          entrepreneurStartupMentions: Math.floor(buzzBase * entrepreneurFactor),
          businessClosureMentions: Math.floor(buzzBase * closureFactor),
          businessTypeSwitchMentions: Math.floor(buzzBase * switchFactor),
          keywordFrequency,
          trendAnalysis,
        });
      });
      
      await monthlyReportRepository.save(monthlyReports);
      console.log(`${monthlyReports.length} monthly reports created`);
    }

    console.log('Database seeding completed successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}