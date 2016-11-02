import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('index.html')
})

export default router;
