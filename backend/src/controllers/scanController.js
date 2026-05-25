const { analyzeUrlRisk } = require("../services/urlRiskService");

const analyzeScan = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({ message: "Please enter a URL before analyzing." });
    }

    const result = analyzeUrlRisk(url);

    await req.app.locals.prisma.scan.create({
      data: {
        url: result.url,
        score: result.score,
        level: result.level,
        issues: JSON.stringify(result.issues),
        recommendation: result.recommendation,
        userId: req.user.id
      }
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getScanHistory = async (req, res, next) => {
  try {
    const scans = await req.app.locals.prisma.scan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      scans: scans.map((scan) => ({
        ...scan,
        issues: JSON.parse(scan.issues)
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeScan,
  getScanHistory
};
