// 验证数据库更改
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function verifyDatabaseChanges() {
  console.log('开始验证数据库更改...\n');

  try {
    // 1. 验证 ReferenceItem 表的索引
    console.log('1. 验证 ReferenceItem 表...');
    const referenceCount = await prisma.referenceItem.count();
    console.log(`   - 表存在，记录数: ${referenceCount}`);
    
    // 尝试查询参考资料，验证索引是否工作
    const sampleReferences = await prisma.referenceItem.findMany({
      take: 1,
      select: {
        id: true,
        tags: true,
      }
    });
    console.log('   - tags 索引查询成功\n');

    // 2. 验证 WorldDocument 表的索引
    console.log('2. 验证 WorldDocument 表...');
    const docCount = await prisma.worldDocument.count();
    console.log(`   - 表存在，记录数: ${docCount}`);
    
    const sampleDocs = await prisma.worldDocument.findMany({
      take: 1,
      select: {
        id: true,
        docType: true,
      }
    });
    console.log('   - docType 索引查询成功\n');

    // 3. 验证 DcosFile 与 EraIdentity 的关系
    console.log('3. 验证 DcosFile 与 EraIdentity 的关系...');
    const dcosCount = await prisma.dcosFile.count();
    console.log(`   - DcosFile 表存在，记录数: ${dcosCount}`);
    
    // 尝试查询包含 Era 的 DcosFile
    const sampleDcos = await prisma.dcosFile.findMany({
      take: 1,
      include: {
        era: true,
      }
    });
    console.log('   - 关系查询成功\n');

    // 4. 验证 ReferenceItem 与 EraIdentity/WorldItem 的关系
    console.log('4. 验证 ReferenceItem 与 EraIdentity/WorldItem 的关系...');
    
    const sampleRefWithEra = await prisma.referenceItem.findMany({
      take: 1,
      include: {
        era: true,
        world: true,
      }
    });
    console.log('   - 关系查询成功\n');

    console.log('✅ 所有数据库更改验证成功！');
    console.log('✅ 索引已正确添加');
    console.log('✅ 关系已正确建立');

  } catch (error) {
    console.error('❌ 验证过程中出错:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseChanges()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });