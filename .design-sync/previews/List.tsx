import {
  List, ListRow, ListSoftIcon, ListAvatar, ListStore,
  ListButton, ListTag, ListCheck,
} from '@mav/design-system';

const ProfileIcon = () => (
  <span className="li-softic">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5a6 6 0 0 1 11 0" />
    </svg>
  </span>
);

export const Contacts = () => (
  <div style={{ width: 400, maxWidth: '100%' }}>
    <List>
      <ListRow
        name="Julio Santos"
        subtitle="julio@fyscaltech.com"
        leading={<ListAvatar initials="J" background="linear-gradient(135deg,#6b8af7,#3a5fd9)" />}
        trailing={<ListTag>Owner</ListTag>}
      />
      <ListRow
        name="Mom"
        subtitle="+63 933 4234 222"
        leading={<ListAvatar initials="M" background="linear-gradient(135deg,#f76b8a,#c9457a)" />}
        trailing={<ListButton>Default</ListButton>}
      />
      <ListRow name="Thailand" trailing={<ListCheck />} />
    </List>
  </div>
);

export const Composition = () => (
  <div style={{ width: 400, maxWidth: '100%' }}>
    <List>
      <ListRow name="Profile" leading={<ProfileIcon />} />
      <ListRow name="+63 933 4234 222" />
      <ListRow
        name="7-Eleven"
        leading={<ListStore label="7-11" background="#00893d" />}
        trailing={<ListTag>Tag</ListTag>}
      />
      <ListRow
        name="Transactions"
        subtitle="Last synced 2m ago"
        leading={
          <ListSoftIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </ListSoftIcon>
        }
      />
    </List>
  </div>
);
