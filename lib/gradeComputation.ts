import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function computeStudentGrade(studentId: string, courseId: string) {
  // Get all grade entries for student in course
  const gradeEntries = await prisma.gradeEntry.findMany({
    where: {
      studentId,
      assessment: {
        courseId
      },
      status: 'APPROVED'
    },
    include: {
      assessment: true
    }
  });

  if (gradeEntries.length === 0) return null;

  // Calculate weighted total
  let totalWeighted = 0;
  let totalWeight = 0;

  for (const entry of gradeEntries) {
    const percentage = (entry.marks / entry.assessment.maxMarks) * 100;
    const weightedScore = (percentage * entry.assessment.weight) / 100;
    totalWeighted += weightedScore;
    totalWeight += entry.assessment.weight;
  }

  // Get grade scale
  const gradeScale = await prisma.gradeScale.findFirst({
    where: {
      min: { lte: Math.round(totalWeighted) },
      max: { gte: Math.round(totalWeighted) }
    }
  });

  const letterGrade = gradeScale?.letter || 'F';
  const gpaPoints = gradeScale?.points || 0;

  // Save computed grade
  const computedGrade = await prisma.computedGrade.upsert({
    where: {
      studentId_courseId: {
        studentId,
        courseId
      }
    },
    update: {
      totalWeighted,
      letterGrade,
      gpaPoints,
      computedAt: new Date()
    },
    create: {
      studentId,
      courseId,
      totalWeighted,
      letterGrade,
      gpaPoints
    }
  });

  return computedGrade;
}