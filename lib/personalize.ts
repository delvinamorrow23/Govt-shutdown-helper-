import type { ChildProfile } from './types';
import { getGuide } from './guides';

// Local NAME personalization. This is the ONLY personalization Gleea applies to
// story content: substituting {{CHILD_NAME}} and {{GUIDE_NAME}} tokens into
// authored text. There is deliberately no AI generation of READ/DO/SHINE
// content (non-negotiable content principle) — so this runs entirely on-device,
// needs no network, and collects no data.
export function personalize(text: string, profile: ChildProfile): string {
  const name = (profile.name || 'friend').trim();
  const guide = getGuide(profile.guideId);
  return text
    .replaceAll('{{CHILD_NAME}}', name)
    .replaceAll('{{GUIDE_NAME}}', guide.name);
}

export const AGE_BAND_LABEL: Record<ChildProfile['ageBand'], string> = {
  seedling: 'Seedling (3–4)',
  sprout: 'Sprout (5–6)',
  bloomer: 'Bloomer (7–8)',
};
