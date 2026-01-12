'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getParents, createParent, updateParent, deleteParent, getAnswers } from '@/lib/firebase/firestore';
import { uploadParentPhoto, deleteParentPhoto } from '@/lib/firebase/storage';
import type { Parent } from '@/lib/types';

export interface ParentWithProgress extends Parent {
  answeredCount: number;
  totalQuestions: number;
}

export function useParents() {
  const { user } = useAuth();
  const [parents, setParents] = useState<ParentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParents = useCallback(async () => {
    if (!user) {
      setParents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedParents = await getParents(user.uid);

      // Fetch answer counts for each parent
      const parentsWithProgress = await Promise.all(
        fetchedParents.map(async (parent) => {
          const answers = await getAnswers(user.uid, parent.id);
          return {
            ...parent,
            answeredCount: answers.length,
            totalQuestions: parent.questionCount || 25,
          };
        })
      );

      setParents(parentsWithProgress);
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError('Failed to load parents');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const addParent = async (data: {
    name: string;
    relationship: 'mother' | 'father' | 'other';
    photoFile?: File;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Create parent first to get the ID
      const parentId = await createParent(user.uid, {
        name: data.name,
        relationship: data.relationship,
        photoUrl: null,
        questionCount: 25,
      });

      // Upload photo if provided
      let photoUrl: string | null = null;
      if (data.photoFile) {
        photoUrl = await uploadParentPhoto(user.uid, parentId, data.photoFile);
        await updateParent(user.uid, parentId, { photoUrl });
      }

      // Refresh the list
      await fetchParents();

      return parentId;
    } catch (err) {
      console.error('Error adding parent:', err);
      throw new Error('Failed to add parent');
    }
  };

  const editParent = async (
    parentId: string,
    data: {
      name?: string;
      relationship?: 'mother' | 'father' | 'other';
      photoFile?: File;
      removePhoto?: boolean;
    }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const parent = parents.find((p) => p.id === parentId);

      // Handle photo changes
      let photoUrl = parent?.photoUrl;

      if (data.removePhoto && photoUrl) {
        await deleteParentPhoto(photoUrl);
        photoUrl = null;
      } else if (data.photoFile) {
        // Delete old photo if exists
        if (photoUrl) {
          await deleteParentPhoto(photoUrl);
        }
        photoUrl = await uploadParentPhoto(user.uid, parentId, data.photoFile);
      }

      // Update parent document
      await updateParent(user.uid, parentId, {
        ...(data.name && { name: data.name }),
        ...(data.relationship && { relationship: data.relationship }),
        ...(photoUrl !== undefined && { photoUrl }),
      });

      // Refresh the list
      await fetchParents();
    } catch (err) {
      console.error('Error updating parent:', err);
      throw new Error('Failed to update parent');
    }
  };

  const removeParent = async (parentId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const parent = parents.find((p) => p.id === parentId);

      // Delete photo if exists
      if (parent?.photoUrl) {
        await deleteParentPhoto(parent.photoUrl);
      }

      // Delete parent document
      await deleteParent(user.uid, parentId);

      // Refresh the list
      await fetchParents();
    } catch (err) {
      console.error('Error deleting parent:', err);
      throw new Error('Failed to delete parent');
    }
  };

  return {
    parents,
    loading,
    error,
    addParent,
    editParent,
    removeParent,
    refreshParents: fetchParents,
  };
}
