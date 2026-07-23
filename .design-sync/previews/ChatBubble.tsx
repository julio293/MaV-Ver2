import { ChatBubble } from '@mav/design-system';

const thread = { display: 'flex', flexDirection: 'column' as const, gap: 12, width: 390, maxWidth: '100%' };

export const Conversation = () => (
  <div className="cthread in" style={thread}>
    <ChatBubble side="in" avatar="A" name="Allison Allan" short text="Are we still on for 3pm?" time="09:24" />
    <ChatBubble side="out" short text="Yep — see you then!" time="09:24" delivered />
    <ChatBubble side="in" avatar="A" name="Allison Allan" text="I'll bring the signed contracts and the updated invoices so we can wrap the onboarding in one sitting." time="09:26" />
  </div>
);

export const ReactedAndReplied = () => (
  <div className="cthread in" style={thread}>
    <ChatBubble side="in" short text="Great work on the demo 🎉" time="09:25" react="❤️" />
    <ChatBubble side="out" short text="Thanks!" time="09:25" delivered react={<>👍 <span className="n">2</span></>} />
    <ChatBubble side="out" short text="On it now." time="09:26" delivered reply={{ who: 'Allison Allan', qt: 'Can you send the deck?' }} />
  </div>
);
