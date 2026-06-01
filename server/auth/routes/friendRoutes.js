import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  sendFriendRequest,
  respondToRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
} from '../controllers/friends/friendController.js';

const router = Router();
router.use(authMiddleware);

router.post('/request/:userId', sendFriendRequest);
router.put('/request/:requestId', respondToRequest);
router.get('/', getFriends);
router.get('/pending', getPendingRequests);
router.delete('/:userId', removeFriend);

export default router;
