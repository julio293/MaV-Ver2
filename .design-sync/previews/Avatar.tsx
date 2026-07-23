import { Avatar, AvatarProfile, AvatarStack } from '@mav/design-system';

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
    <Avatar size="3xl" color="primary" initials="AM" />
    <Avatar size="xl" color="primary" initials="AM" />
    <Avatar size="lg" color="primary" initials="AM" />
    <Avatar size="md" color="primary" initials="AM" />
    <Avatar size="sm" color="primary" initials="AM" />
    <Avatar size="xs" color="primary" initials="AM" />
  </div>
);

export const Colors = () => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
    <Avatar size="lg" color="grey" initials="JS" />
    <Avatar size="lg" color="primary" initials="RT" />
    <Avatar size="lg" color="red" initials="MG" />
    <Avatar size="lg" shape="squared" color="primary" initials="IN" />
    <Avatar size="lg" color="primary" initials="SF" status />
  </div>
);

export const ProfilesAndStack = () => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
    <AvatarProfile name="Amara">
      <Avatar size="lg" color="primary" initials="AM" />
    </AvatarProfile>
    <AvatarProfile name="Safira">
      <Avatar size="lg" color="grey" initials="S" />
    </AvatarProfile>
    <AvatarStack size={48} more="+3">
      <Avatar color="primary" initials="AM" />
      <Avatar color="grey" initials="IN" />
      <Avatar color="red" initials="MG" />
      <Avatar color="primary" initials="S" />
    </AvatarStack>
  </div>
);
