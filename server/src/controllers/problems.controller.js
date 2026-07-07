import prisma from "../prisma.js";

const DEV_USER_ID = "dev-user-1";
const VALID_PLATFORMS = ["LEETCODE", "CODEFORCES", "OTHER"];
const VALID_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const VALID_STATUSES = ["SOLVED", "REVISIT"];

const createProblem = async (req, res, next) => {
    try {
        const {
            title,
            url,
            platform,
            difficulty,
            timeComplexity,
            spaceComplexity,
            notes,
            status,
            patternId,
            tags,
        } = req.body;

        if (!title || !platform) {
            return res
                .status(400)
                .json({ error: "title and platform are required." });
        }
        if (!VALID_PLATFORMS.includes(platform)) {
            return res.status(400).json({
                error: `platform must be one of: ${VALID_PLATFORMS.join(", ")}`,
            });
        }
        if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {   //optional so check existence first
            return res.status(400).json({
                error: `difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
            });
        }
        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
            });
        }

        const problem = await prisma.problem.create({
            data: {
                title,
                url,
                platform,
                difficulty,
                timeComplexity,
                spaceComplexity,
                notes,
                status: status || "SOLVED",
                tags: tags || [],
                patternId: patternId || null,
                userId: DEV_USER_ID,
            },
        });

        res.status(201).json(problem);
    } catch (err) {
        next(err);
    }
};
const getProblems = async (req, res, next) => {
    try {
        const { platform, status, patternId, q } = req.query;

        const where = { userId: DEV_USER_ID };
        if (platform) where.platform = platform;
        if (status) where.status = status;
        if (patternId) where.patternId = patternId;
        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { notes: { contains: q, mode: "insensitive" } },
            ];
        }

        const problems = await prisma.problem.findMany({
            where,
            include: { pattern: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(problems);
    } catch (err) {
        next(err);
    }
};

const getProblem = async (req, res, next) => {
    try {
        const problem = await prisma.problem.findFirst({
            where: { id: req.params.id, userId: DEV_USER_ID },
            include: { pattern: true },
        });
        if (!problem)
            return res.status(404).json({ error: "Problem not found." });
        res.json(problem);
    } catch (err) {
        next(err);
    }
};
const updateProblem = async (req, res, next) => {
    try {
        const result = await prisma.problem.updateMany({
            where: { id: req.params.id, userId: DEV_USER_ID },
            data: req.body,
        });
        if (result.count === 0)
            return res.status(404).json({ error: "Problem not found." });
        res.json({ updated: true });
    } catch (err) {
        next(err);
    }
};
const deleteProblem = async (req, res, next) => {
    try {
        const result = await prisma.problem.deleteMany({
            where: { id: req.params.id, userId: DEV_USER_ID },
        });
        if (result.count === 0)
            return res.status(404).json({ error: "Problem not found." });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export {createProblem, getProblems, getProblem, updateProblem, deleteProblem};
