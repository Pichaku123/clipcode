import prisma from "../prisma.js";

const DEV_USER_ID = "dev-user-1";
const VALID_LANGUAGES = ["CPP", "JS", "PYTHON", "JAVA"];

const createSnippet = async (req, res, next) => {
    try {
        const { title, language, code, description, tags, patternId } =
            req.body;
        if (!title || !language || !code) {
            return res
                .status(400)
                .json({ error: "title, language, and code are required." });
        }
        if (!VALID_LANGUAGES.includes(language)) {
            return res.status(400).json({
                error: `language must be one of: ${VALID_LANGUAGES.join(", ")}`,
            });
        }

        const snippet = await prisma.snippet.create({
            data: {
                title,
                language,
                code,
                description,
                tags: tags || [],
                patternId: patternId || null,
                userId: DEV_USER_ID, //later req.params.id
            },
        });

        res.status(201).json(snippet);
    } catch (err) {
        next(err);
    }
};

//GET all snippets for a pattern
const getSnippets = async (req, res, next) => {
    try {
        const { language, patternId, q } = req.query;

        const where = { userId: DEV_USER_ID };
        if (language) where.language = language; //only add if provided, for filtering
        if (patternId) where.patternId = patternId;
        if (q) {
            //or logic, so user = x AND language = lan AND pid = pid(both optional) AND (title contains q OR code contains q)
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { code: { contains: q, mode: "insensitive" } },
            ];
        }

        const snippets = await prisma.snippet.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        res.json(snippets);
    } catch (err) {
        next(err);
    }
};

const getSnippet = async (req, res, next) => {
    try {
        const snippet = await prisma.snippet.findFirst({
            where: { id: req.params.id, userId: DEV_USER_ID },
            include: { pattern: true },
        });
        if (!snippet)
            return res.status(404).json({ error: "Snippet not found." });
        res.json(snippet);
    } catch (err) {
        next(err);
    }
};

const updateSnippet = async (req, res, next) => {
    try {
        const result = await prisma.snippet.updateMany({
            //updatemany because id+userid is not unique filter
            where: { id: req.params.id, userId: DEV_USER_ID },
            data: req.body,
        });
        if (result.count === 0)
            return res.status(404).json({ error: "Snippet not found." });
        res.json({ updated: true });
    } catch (err) {
        next(err);
    }
};

const deleteSnippet = async (req, res, next) => {
    try {
        const result = await prisma.snippet.deleteMany({
            where: { id: req.params.id, userId: DEV_USER_ID },
        });
        if (result.count === 0)
            return res.status(404).json({ error: "Snippet not found." });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export { createSnippet, getSnippets, getSnippet, updateSnippet, deleteSnippet };
