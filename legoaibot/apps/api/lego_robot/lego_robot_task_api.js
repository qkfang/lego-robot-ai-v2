const legowebchat = require('../models/legowebchat');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/* CREATE */
router.post('/webchat', (req, res) => {
  legowebchat.create({ message: req.body.message })
    .then((result) => {
      console.log('CREATED.' + req.body.message);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log('CREATE Error: ' + err);
      res.status(400).send('Error');
    })
});

// router.route('/:id')
//   .delete((req, res) => {
//     Task.findById(req.params.id)
//       .then((task) => {
//         if (task) {
//           task.delete(() => {
//             res.status(200).json(task);
//           });
//         } else {
//           res.status(404).send('Not found');
//         }
//       })
//       .catch((err) => {
//         console.log('DELETE Error: ' + err);
//         res.status(500).send('Error');
//       })
//   });

module.exports = router;