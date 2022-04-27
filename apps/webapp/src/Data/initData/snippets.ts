import { generateSnippetId } from '@mexit/core'

import { ABTestingSnippet } from './ABTestingSnippet'
import { BugReportTemplate } from './bugReportTemplate'
import { DesignSpecSnippet } from './DesignSpecSnippet'
import { GTMPlanSnippet } from './GTMPlanSnippet'
import { OnboardingDoc } from './onboardingDoc'
import { OnePagerSnippet } from './OnePagerSnippet'
import { PRDTemplate } from './PRD_Snippet'
import { ProductSpecSnippet } from './ProductSpecSnippet'
import { ReleaseSnippet } from './ReleaseSnippet'

export const initialSnippets = [
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'PRD',
        content: PRDTemplate
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'Bug Report',
        content: BugReportTemplate
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'Release Checklist',
        content: ReleaseSnippet
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'One Pager',
        content: OnePagerSnippet
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'A/B Testing',
        content: ABTestingSnippet
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'Product Spec',
        content: ProductSpecSnippet
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'GTM Plan',
        content: GTMPlanSnippet
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'Design Spec',
        content: DesignSpecSnippet
    },
    {
        icon: 'ri:quill-pen-line',
        id: generateSnippetId(),
        isTemplate: true,
        title: 'Onboarding',
        content: OnboardingDoc
    }
]
