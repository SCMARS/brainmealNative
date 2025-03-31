import { db } from '../config/firebase';
import { Challenge, User, Achievement } from '../types';

const socialService = {
  async createChallenge(type: string, participants: User[]): Promise<Challenge> {
    const challenge = {
      type,
      participants: participants.map(p => p.id),
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      status: 'active',
      leaderboard: []
    };

    const docRef = await db.collection('challenges').add(challenge);
    return { id: docRef.id, ...challenge };
  },

  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    await db.collection('challenges').doc(challengeId).update({
      participants: firebase.firestore.FieldValue.arrayUnion(userId)
    });
  },

  async getLeaderboard(challengeId: string): Promise<User[]> {
    const challenge = await db.collection('challenges').doc(challengeId).get();
    return challenge.data()?.leaderboard || [];
  }
};

export default socialService; 