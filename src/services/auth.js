import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, TRIRTY_DAY } from '../constants/index.js';

export const registerUser = async (payload) => {
  const { password, email } = payload;

  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const bcryptPassword = await bcrypt.hash(password, 10);

  const data = await User.create({ ...payload, password: bcryptPassword });

  const responseData = {
    name: data.name,
    email: data.email,
    _id: data._id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return responseData;
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + TRIRTY_DAY);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: user._id });

  const session = createSession();

  const data = await Session.create({
    userId: user._id,
    ...session,
  });

  return data;
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const currentSession = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > new Date(currentSession.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session expired');
  }
  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  const data = await Session.create({
    userId: currentSession.userId,
    ...newSession,
  });

  return data;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ userId: sessionId });
};
