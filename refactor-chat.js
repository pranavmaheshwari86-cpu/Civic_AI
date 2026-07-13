const fs = require('fs');

const path = 'apps/web/app/[locale]/chat/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
const imports = `import { EmergencyModal } from '@/components/chat/EmergencyModal';
import { ChatInput } from '@/components/chat/ChatInput';
import { SuggestedPromptsList } from '@/components/chat/SuggestedPromptsList';
`;
content = content.replace("import { useReducedMotion } from '@/lib/useReducedMotion';", "import { useReducedMotion } from '@/lib/useReducedMotion';\n" + imports);

// 2. Remove SUGGESTED_PROMPTS
content = content.replace(/const SUGGESTED_PROMPTS = \[[^]*?\];/, '');

// 3. Remove HeartPulse, CreditCard, GraduationCap, TriangleAlert, AlertTriangle, Paperclip
const removals = ['HeartPulse', 'CreditCard', 'GraduationCap', 'TriangleAlert', 'AlertTriangle', 'Paperclip'];
removals.forEach(r => {
    content = content.replace(new RegExp(`\\b${r}\\b\\s*,?\\s*`, 'g'), '');
});
content = content.replace(/,\s*}/g, ' }');

// 4. Replace SuggestedPrompts
const promptRe = /\{\/\* Suggested Prompts \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\) : \(/;
content = content.replace(promptRe, `<SuggestedPromptsList onSelect={sendMessage} />
            </div>
          ) : (`);

// 5. Remove firstEmergencyActionRef
content = content.replace(/\/\/ Focus target inside emergency modal — WCAG 2.4.3 focus management[\s\S]*?const firstEmergencyActionRef = useRef<HTMLAnchorElement>\(null\);\n?/, '');

// Remove the related useEffect
content = content.replace(/\/\/ Move focus into emergency modal when it opens \(WCAG 2.4.3\)[\s\S]*?useEffect\(\(\) => \{[\s\S]*?\}, \[isEmergency\]\);\n?/, '');

// 6. Replace ChatInput block
const chatInputRe = /\{\/\* ── Input Area \(Fixed Bottom\) ── \*\/\}[\s\S]*?Verify important information with official sources.\s*<\/p>\s*<\/div>\s*<\/div>/;
content = content.replace(chatInputRe, `<ChatInput
          ref={inputRef}
          input={input}
          setInput={setInput}
          onSubmit={handleFormSubmit}
          isTyping={isTyping}
          isInputDisabled={isInputDisabled}
        />`);

// 7. Replace Emergency Modal block
const emergencyModalRe = /\{\/\* ── Emergency Modal — fully accessible dialog ── \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/;
content = content.replace(emergencyModalRe, `<EmergencyModal
        isOpen={isEmergency}
        onClose={() => setIsEmergency(false)}
        reducedMotion={reducedMotion}
      />`);

fs.writeFileSync(path, content);
console.log('Refactored page.tsx');
