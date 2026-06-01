import User from '../../model/userModel.js';
import { AppError } from '../../middleware/errorHandler.js';

const PROFILE_FIELDS = 'name username bio avatar location website socials isProfilePublic email createdAt';
const PUBLIC_FIELDS = 'name username bio avatar location website socials createdAt';

export async function getMyProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select(PROFILE_FIELDS);
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = req.body;

    if (updates.username) {
      const existing = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user.userId },
      });
      if (existing) return next(new AppError('Username already taken', 409));
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select(PROFILE_FIELDS);

    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function searchProfiles(req, res, next) {
  try {
    const q = req.query.q?.toString().trim();
    if (!q || q.length < 2) return res.json({ success: true, users: [] });

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ],
    })
    .select('name username bio avatar isProfilePublic')
    .limit(20);

    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select(PUBLIC_FIELDS + ' isProfilePublic');

    if (!user) return next(new AppError('Profile not found', 404));
    if (!user.isProfilePublic) return next(new AppError('This profile is private', 403));

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}
