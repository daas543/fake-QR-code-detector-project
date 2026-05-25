const getDashboardStats = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const userId = req.user.id;

    const [totalScans, lowRiskScans, mediumRiskScans, highRiskScans, recentScans] = await Promise.all([
      prisma.scan.count({ where: { userId } }),
      prisma.scan.count({ where: { userId, level: "Low Risk" } }),
      prisma.scan.count({ where: { userId, level: "Medium Risk" } }),
      prisma.scan.count({ where: { userId, level: "High Risk" } }),
      prisma.scan.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);

    const averageScoreResult = await prisma.scan.aggregate({
      where: { userId },
      _avg: { score: true }
    });

    res.json({
      totalScans,
      lowRiskScans,
      mediumRiskScans,
      highRiskScans,
      averageScore: Math.round(averageScoreResult._avg.score || 0),
      recentScans: recentScans.map((scan) => ({
        ...scan,
        issues: JSON.parse(scan.issues)
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
