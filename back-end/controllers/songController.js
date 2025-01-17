const express = require("express");
const song = express.Router();
const {
  getAllSongsData,
  songById,
  createSong,

  deleteSong,
  updateSongById,
} = require("../queries/song");

//VALIDATION IMPORT
const {
  checkName,
  checkBoolean,
  checkArtist,
} = require("../validation/validation");

// Index

song.get("/", async (req, res) => {
  try {
    const allSongData = await getAllSongsData();
    res.status(200).json(allSongData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting all songs" });
  }
});

// Get Song by ID
song.get("/:id", async (req, res) => {
  const { id } = req.params;
  const song = await songById(id);

  if (song.length === 0) {
    res.status(404).json({ error: "there arent any songs " });
  } else {
    res.json(song[0]);
  }
});
//CREATE SONG

song.post("/", checkName, checkBoolean, checkArtist, async (req, res) => {
  const createdSong = await createSong(req.body);
  console.log(createdSong);
  res.status(200).json(createdSong);
});
//UPDATE SONG

song.put("/:id", checkName, checkArtist, checkBoolean, async (req, res) => {
  const { id } = req.params;
  const updatedSong = await updateSongById(id, req.body);

  if (!updatedSong) {
    res.status(404).json({ message: "Song not found!", error: true });
  } else {
    res.status(200).json(updatedSong);
  }
});

//DELETE SONG
song.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const song = await songById(id);

    if (song.length === 0) {
      return res.status(404).json({ message: "Song not found", error: true });
    }

    const deletedSong = await deleteSong(id);

    if (!deletedSong) {
      res.status(404).json({ message: "No data found!", error: true });
    } else {
      console.log(deletedSong);
      return res.status(200).json(deletedSong);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while deleting the song" });
  }
});

module.exports = song;
