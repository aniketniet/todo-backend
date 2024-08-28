const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// Create a new Todo
router.post("/", async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new Todo({
            title,
            description,
        });
        const todo = await newTodo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Get Todos with pagination
router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const todos = await Todo.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Todo.countDocuments();
        res.status(200).json({
            todos,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Get a single Todo by ID
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Update a Todo by ID
router.put("/:id", async (req, res) => {
    const { title, description } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
