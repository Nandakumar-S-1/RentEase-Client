import { useState, useEffect, useCallback } from "react";
import type { ProfileData, UpdateProfileData } from "../types/profileTypes";
import { getProfile, updateProfile } from "../services/profileService";
import { ProfileMessages } from "../../../types/constants/messages.constant";

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ProfileMessages.LOAD_FAILED;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = async (data: UpdateProfileData) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await updateProfile(data);
      if (response.success) {
        await fetchProfile();
      }
      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ProfileMessages.UPDATE_FAILED;
      setError(message);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, updating, error, saveProfile, fetchProfile };
};
