import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from './config';
import type { User, Parent, Answer, CustomQuestion, SelectedQuestion } from '../types';

// ============ User Operations ============

export async function createUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    isPremium: false,
    preferredLocale: 'en',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  return {
    uid: userId,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
  } as User;
}

export async function updateUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ============ Parent Operations ============

export async function createParent(userId: string, data: Omit<Parent, 'id' | 'createdAt' | 'updatedAt'>) {
  const parentsRef = collection(db, 'users', userId, 'parents');
  const parentRef = doc(parentsRef);

  await setDoc(parentRef, {
    ...data,
    questionCount: 0, // Starts with 0, incremented when questions are added
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return parentRef.id;
}

export async function getParent(userId: string, parentId: string): Promise<Parent | null> {
  const parentRef = doc(db, 'users', userId, 'parents', parentId);
  const parentSnap = await getDoc(parentRef);

  if (!parentSnap.exists()) return null;

  const data = parentSnap.data();
  return {
    id: parentId,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
  } as Parent;
}

export async function getParents(userId: string): Promise<Parent[]> {
  const parentsRef = collection(db, 'users', userId, 'parents');
  const q = query(parentsRef, orderBy('createdAt', 'desc'));
  const parentsSnap = await getDocs(q);

  return parentsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    } as Parent;
  });
}

export async function updateParent(userId: string, parentId: string, data: Partial<Parent>) {
  const parentRef = doc(db, 'users', userId, 'parents', parentId);
  await updateDoc(parentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteParent(userId: string, parentId: string) {
  const parentRef = doc(db, 'users', userId, 'parents', parentId);
  await deleteDoc(parentRef);
}

// ============ Answer Operations ============

export async function saveAnswer(
  userId: string,
  parentId: string,
  questionId: string,
  questionText: string,
  questionTextLocale: string | null,
  isCustomQuestion: boolean,
  answer: string
) {
  const answerRef = doc(db, 'users', userId, 'parents', parentId, 'answers', questionId);

  await setDoc(
    answerRef,
    {
      questionId,
      questionText,
      questionTextLocale,
      isCustomQuestion,
      answer,
      answeredAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getAnswer(userId: string, parentId: string, questionId: string): Promise<Answer | null> {
  const answerRef = doc(db, 'users', userId, 'parents', parentId, 'answers', questionId);
  const answerSnap = await getDoc(answerRef);

  if (!answerSnap.exists()) return null;

  const data = answerSnap.data();
  return {
    ...data,
    answeredAt: (data.answeredAt as Timestamp)?.toDate(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
  } as Answer;
}

export async function getAnswers(userId: string, parentId: string): Promise<Answer[]> {
  const answersRef = collection(db, 'users', userId, 'parents', parentId, 'answers');
  const answersSnap = await getDocs(answersRef);

  return answersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      answeredAt: (data.answeredAt as Timestamp)?.toDate(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    } as Answer;
  });
}

// ============ Custom Question Operations ============

export async function addCustomQuestion(
  userId: string,
  parentId: string,
  questionId: string,
  text: string,
  order: number
) {
  const batch = writeBatch(db);

  const questionRef = doc(db, 'users', userId, 'parents', parentId, 'customQuestions', questionId);
  const parentRef = doc(db, 'users', userId, 'parents', parentId);

  // Add the custom question
  batch.set(questionRef, {
    id: questionId,
    text,
    order,
    createdAt: serverTimestamp(),
  });

  // Increment the parent's questionCount
  batch.update(parentRef, {
    questionCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function getCustomQuestions(userId: string, parentId: string): Promise<CustomQuestion[]> {
  const questionsRef = collection(db, 'users', userId, 'parents', parentId, 'customQuestions');
  const q = query(questionsRef, orderBy('order', 'asc'));
  const questionsSnap = await getDocs(q);

  return questionsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate(),
    } as CustomQuestion;
  });
}

export async function deleteCustomQuestion(userId: string, parentId: string, questionId: string) {
  const batch = writeBatch(db);

  const questionRef = doc(db, 'users', userId, 'parents', parentId, 'customQuestions', questionId);
  const parentRef = doc(db, 'users', userId, 'parents', parentId);
  const answerRef = doc(db, 'users', userId, 'parents', parentId, 'answers', questionId);

  // Delete the custom question
  batch.delete(questionRef);

  // Delete the answer if exists
  batch.delete(answerRef);

  // Decrement the parent's questionCount
  batch.update(parentRef, {
    questionCount: increment(-1),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

// ============ Selected Question Operations ============

export async function addSelectedQuestion(userId: string, parentId: string, questionId: string, order: number) {
  const batch = writeBatch(db);

  const selectedRef = doc(db, 'users', userId, 'parents', parentId, 'selectedQuestions', questionId);
  const parentRef = doc(db, 'users', userId, 'parents', parentId);

  // Add the selected question
  batch.set(selectedRef, {
    questionId,
    order,
    addedAt: serverTimestamp(),
  });

  // Increment the parent's questionCount
  batch.update(parentRef, {
    questionCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function getSelectedQuestions(userId: string, parentId: string): Promise<SelectedQuestion[]> {
  const selectedRef = collection(db, 'users', userId, 'parents', parentId, 'selectedQuestions');
  const q = query(selectedRef, orderBy('order', 'asc'));
  const selectedSnap = await getDocs(q);

  return selectedSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      addedAt: (data.addedAt as Timestamp)?.toDate(),
    } as SelectedQuestion;
  });
}

export async function deleteSelectedQuestion(userId: string, parentId: string, questionId: string) {
  const batch = writeBatch(db);

  const selectedRef = doc(db, 'users', userId, 'parents', parentId, 'selectedQuestions', questionId);
  const parentRef = doc(db, 'users', userId, 'parents', parentId);
  const answerRef = doc(db, 'users', userId, 'parents', parentId, 'answers', questionId);

  // Delete the selected question
  batch.delete(selectedRef);

  // Delete the answer if exists
  batch.delete(answerRef);

  // Decrement the parent's questionCount
  batch.update(parentRef, {
    questionCount: increment(-1),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}
