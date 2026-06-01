import FriendRequest from '../../model/friendRequest.js';
import User from '../../model/userModel.js';
import { AppError } from '../../middleware/errorHandler.js';

export async function sendFriendRequest(req, res, next) {
  try {
    const fromId = req.user.userId;
    const toId = req.params.userId;
    if (fromId === toId) return next(new AppError('Cannot add yourself', 400));

    const toUser = await User.findById(toId);
    if (!toUser) return next(new AppError('User not found', 404));

    const existing = await FriendRequest.findOne({
      $or: [{ from: fromId, to: toId }, { from: toId, to: fromId }],
    });
    if (existing) return next(new AppError('Request already exists', 409));

    const request = await FriendRequest.create({ from: fromId, to: toId });
    res.status(201).json({ success: true, request });
  } catch (err) { next(err); }
}

export async function respondToRequest(req, res, next) {
  try {
    const request = await FriendRequest.findById(req.params.requestId);
    if (!request) return next(new AppError('Request not found', 404));
    if (request.to.toString() !== req.user.userId)
      return next(new AppError('Not authorized', 403));

    const { action } = req.body;
    if (!['accept', 'reject'].includes(action))
      return next(new AppError('Invalid action', 400));

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await request.save();
    res.json({ success: true, request });
  } catch (err) { next(err); }
}

export async function getFriends(req, res, next) {
  try {
    const requests = await FriendRequest.find({
      $or: [{ from: req.user.userId }, { to: req.user.userId }],
      status: 'accepted',
    }).lean();

    const friends = await Promise.all(
      requests.map(async (r) => {
        const friendId = r.from.toString() === req.user.userId ? r.to : r.from;
        return User.findById(friendId).select('name username avatar').lean();
      })
    );

    res.json({ success: true, friends: friends.filter(Boolean) });
  } catch (err) { next(err); }
}

export async function getPendingRequests(req, res, next) {
  try {
    const requests = await FriendRequest.find({
      to: req.user.userId,
      status: 'pending',
    }).lean();

    const populated = await Promise.all(
      requests.map(async (r) => {
        const from = await User.findById(r.from)
          .select('name username avatar bio')
          .lean();
        return { ...r, from };
      })
    );

    res.json({ success: true, requests: populated });
  } catch (err) { next(err); }
}

export async function removeFriend(req, res, next) {
  try {
    await FriendRequest.findOneAndDelete({
      $or: [
        { from: req.user.userId, to: req.params.userId },
        { from: req.params.userId, to: req.user.userId },
      ],
      status: 'accepted',
    });
    res.json({ success: true });
  } catch (err) { next(err); }
}