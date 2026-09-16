export const profileImage = {
  hero: '/assets/images/profile.jpg',
  about: '/assets/images/profile-about.jpg',
};

export function getProfileImage(placement: 'hero' | 'about'): string {
  return profileImage[placement];
}
