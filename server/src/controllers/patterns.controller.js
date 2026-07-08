import prisma from "../prisma.js";

//POST- Create new Pattern
const createPattern = async (req, res, next) => {
    try {
        const { name, triggerSignal } = req.body;   
        if (!name || !triggerSignal) {
            return res.status(400).json({ error: "name and triggerSignal are required." });
        }
        const pattern = await prisma.pattern.create({
            data: { name, triggerSignal, userId: req.user.id },     
        });

        res.status(201).json(pattern);
    } catch (err) {
        next(err);
    }
}

//GET- GET all Patterns for user
const getPatterns = async (req, res, next) => {
    try {
        const patterns = await prisma.pattern.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },     //newest first
        });

        res.json(patterns);
    } catch (err) {
        next(err);
    }
};

//GET- get 1 pattern based on pattern id, along with code snippet + problems
const getPattern = async (req, res, next) => {  
    try {
        const pattern = await prisma.pattern.findFirst({    
            where: { id: req.params.id, userId: req.user.id },
            include: { snippets: true, problems: true },
        });
        
        if (!pattern) return res.status(404).json({ error: "Pattern not found." });
        res.json(pattern);
    } catch (err) {
        next(err);
    }
};

//Update all patterns based on pattern id and userid
//TODO- add validation
const updatePattern = async (req, res, next) => {
    try {
        const result = await prisma.pattern.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: req.body,
        });
        if (result.count === 0)
            return res.status(404).json({ error: "Pattern not found." });
        res.json({ updated: true });
    } catch (err) {
        next(err);
    }
};

const deletePattern = async (req, res, next) => {
    try {
        const result = await prisma.pattern.deleteMany({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (result.count === 0)
            return res.status(404).json({ error: "Pattern not found." });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export { createPattern, getPattern, getPatterns, updatePattern, deletePattern };
