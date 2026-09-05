const express = require("express");
const Document = require("../models/Document");
const User = require("../models/User");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required"
      });
    }

    const documents = await Document.find({
      $or: [
        { owner: userId },
        { sharedWith: userId }
      ]
    })
      .populate("owner", "name email")
      .populate("sharedWith", "name email")
      .sort({ updatedAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents"
    });
  }
});



router.post("/", async (req, res) => {
  try {
    const { title, owner } = req.body;

    console.log(title, owner)

    if (!owner) {
      return res.status(400).json({
        message: "owner is required"
      });
    }

    const document = await Document.create({
      title: title?.trim() || "Untitled Document",
      owner,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph"
          }
        ]
      }
    });

    const populatedDocument = await document.populate(
      "owner",
      "name email"
    );

    res.status(201).json(populatedDocument);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create document"
    });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const { userId } = req.query;

    const document = await Document.findById(req.params.id)
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    const hasAccess =
      document.owner._id.toString() === userId ||
      document.sharedWith.some(
        (user) => user._id.toString() === userId
      );

    if (!hasAccess) {
      return res.status(403).json({
        message: "You do not have access to this document"
      });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch document"
    });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    const hasAccess =
      document.owner.toString() === userId ||
      document.sharedWith.some(
        (id) => id.toString() === userId
      );

    if (!hasAccess) {
      return res.status(403).json({
        message: "You do not have access to this document"
      });
    }

    if (title !== undefined) {
      document.title = title.trim() || "Untitled Document";
    }

    if (content !== undefined) {
      document.content = content;
    }

    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update document"
    });
  }
});


router.post("/:id/share", async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    if (!userId || !targetUserId) {
      return res.status(400).json({
        message: "userId and targetUserId are required"
      });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    // Only the owner can share the document
    if (document.owner.toString() !== userId) {
      return res.status(403).json({
        message: "Only the owner can share this document"
      });
    }

    // Prevent sharing with yourself
    if (userId === targetUserId) {
      return res.status(400).json({
        message: "Owner already has access to this document"
      });
    }

    // Prevent duplicate sharing
    if (
      document.sharedWith.some(
        (id) => id.toString() === targetUserId
      )
    ) {
      return res.status(400).json({
        message: "Document is already shared with this user"
      });
    }

    // Make sure target user exists
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "Target user not found"
      });
    }

    document.sharedWith.push(targetUserId);

    await document.save();

    const updatedDocument = await Document.findById(document._id)
      .populate("owner", "name email")
      .populate("sharedWith", "name email");

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to share document"
    });
  }
});

module.exports = router;