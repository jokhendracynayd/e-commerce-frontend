import { userApi } from '@/lib/api';
import { UserUpdateRequest } from '@/types/user';
import { UserDetails } from '@/types/auth';

/**
 * userService wraps direct API calls to provide a single abstraction layer
 * for components. This keeps UI layers independent from low-level API details.
 */
export const userService = {
  /**
   * Update the current user's profile.
   */
  async updateProfile(data: UserUpdateRequest): Promise<UserDetails> {
    return userApi.updateUserProfile(data);
  },
};

export default userService; 