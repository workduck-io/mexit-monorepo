import { ELEMENT_PARAGRAPH } from '@mexit/core'

import { SmartCaptureConfigType, SmartCaptureFieldTypes, SmartCaptureURLRegexType } from '../Types/SmartCapture'

export const SmartCaptureConfig: SmartCaptureConfigType = {
  LinkedIN: [
    {
      id: 'LABEL_JFAa',
      label: 'Name',
      path: '//h1[@class="text-heading-xlarge inline t-24 v-align-middle break-words"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_37Xb',
      label: 'Headline',
      path: '//div[@class="text-body-medium break-words"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_38CJ',
      label: 'Location',
      path: '//span[@class="text-body-small inline t-black--light break-words"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_X4QV',
      label: 'Current Company',
      path: '//div[@aria-label="Current company"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_eE4a',
      label: 'Education',
      path: '//div[@aria-label="Education"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_Gwpz',
      label: 'About',
      path: '//div[@class="display-flex ph5 pv3"]/div/div[@class="pv-shared-text-with-see-more t-14 t-normal t-black display-flex align-items-center"]/div/span[@aria-hidden="true"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_rPag',
      label: 'Conections',
      path: '//li[@class="text-body-small"]/span',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    },
    {
      id: 'LABEL_yXR7',
      label: 'Mutual Connections',
      path: '//span[@class="t-normal t-black--light t-14 hoverable-link-text"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        row: 0
      }
    }
  ],
  Instagram: [
    {
      id: 'LABEL_cNeh',
      label: 'Name',
      path: '//h2[@class="_aacl _aacs _aact _aacx _aada"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_UJWY',
      label: 'Stats',
      path: '//ul[@class="_aa_7"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_BQe4',
      label: 'Bio',
      path: '//div[@class="_aa_c"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ],
  GitHub: [
    {
      id: 'LABEL_Gw3e',
      label: 'Username',
      path: '//span[@class="p-nickname vcard-username d-block"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_UaNd',
      label: 'Bio',
      path: '//div[@class="p-note user-profile-bio mb-3 js-user-profile-bio f4"]/div',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_eBgk',
      label: 'Stats',
      path: '//div[@class="mb-3"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_d8P4',
      label: 'Organizations',
      path: '//span[@class="p-org"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_DKPG',
      label: 'Location',
      path: '//span[@class="p-label"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_m743',
      label: 'Email',
      path: '//li[@itemprop="email"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_MYya',
      label: 'Website',
      path: '//li[@itemprop="url"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_wRJX',
      label: 'Twitter',
      path: '//li[@itemprop="twitter"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_z8Fi',
      label: 'Number of Repositories',
      path: '//a[@class="UnderlineNav-item js-responsive-underlinenav-item"]/span',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_NTTa',
      label: 'Total Contributions',
      path: '//h2[@class="f4 text-normal mb-2"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ],
  Twitter: [
    {
      id: 'LABEL_7Meh',
      label: 'User Name',
      path: '//div[@class="css-901oao r-1awozwy r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-1udh08x r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_UrNm',
      label: 'Handle',
      path: '//div[@class="css-901oao css-bfa6kz r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_anfd',
      label: 'Bio',
      path: '//div[@class="css-1dbjc4n"]/div[@data-testid="UserDescription"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_aqhf',
      label: 'Join Date',
      path: '//span[@data-testid="UserJoinDate"]/span',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_BfkD',
      label: 'Following',
      path: '//div[@class="css-1dbjc4n r-1mf7evn"]/a/span',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_a44x',
      label: 'Followers',
      path: '//div[@class="css-1dbjc4n"]/a[@class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ],
  YouTube: [
    {
      id: 'LABEL_NYzw',
      label: 'Chanel Name',
      path: '//yt-formatted-string[@class="style-scope ytd-channel-name"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_YWGW',
      label: 'Subscriber Count',
      path: '//yt-formatted-string[@id="subscriber-count"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_HBjL',
      label: 'Description',
      path: '//yt-formatted-string[@id="description"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_YGdt',
      label: 'Joining Date',
      path: '//div[@id="right-column"]/yt-formatted-string[@class="style-scope ytd-channel-about-metadata-renderer"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_6a3X',
      label: 'Total Views',
      path: '//div[@id="right-column"]/yt-formatted-string[@no-styles]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ],
  Slack: [
    {
      id: 'LABEL_LE4R',
      label: 'Name',
      path: '//span[@class="p-r_member_profile__name__text"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        renderType: SmartCaptureFieldTypes.TEXT,
        row: 0
      }
    },
    {
      id: 'LABEL_z4Qe',
      label: 'Subtitle',
      path: '//div[@class="p-r_member_profile__subtitle"]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        renderType: SmartCaptureFieldTypes.TEXT,
        row: 0
      }
    },
    {
      id: 'LABEL_ipHx',
      label: 'Email',
      path: '(//div[@class="p-rimeto_member_profile_field__value"])[1]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        renderType: SmartCaptureFieldTypes.TEXT,
        row: 0
      }
    },
    {
      id: 'LABEL_pQi8',
      label: 'Phone Number',
      path: '(//div[@class="p-rimeto_member_profile_field__value"])[2]',
      properties: {
        type: ELEMENT_PARAGRAPH,
        renderType: SmartCaptureFieldTypes.NUMBER
      }
    }
  ],
  Producthunt: [
    {
      id: 'LABEL_FkdK',
      label: 'Product Name',
      path: '//h1[@class="style_mt-1__T5D6G style_color-dark-grey__aN5DV style_fontSize-32__072ip style_fontWeight-700__2tqn0"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_hwaJ',
      label: 'Product Title',
      path: '//div[@class="style_mt-2__5s4E_ style_color-light-grey__mkoQQ style_fontSize-18__COuaE style_fontWeight-400__5p97M"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_j46F',
      label: 'No Of Reviews',
      path: '//div[@class="style_flex___KlcI style_direction-row__oinjH style_flex-row-gap-1__VY472 style_justify-center__CzdOP style_align-center__76pto"]/a[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_tNgV',
      label: 'UpVotes',
      path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[1]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_mdza',
      label: 'No Of Launches',
      path: '//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob styles_link__VsvU5"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_EgpT',
      label: 'Followers',
      path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[2]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_iGjW',
      label: 'About',
      path: '//div[@class="style_flex___KlcI style_direction-column__w77hU style_flex-column-gap-4__87DvT style_pb-12__SqQ5M"]/div[@class="style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_4dqi',
      label: 'Post Reviews',
      path: '(//div[@class="style_flex___KlcI style_direction-row__oinjH style_justify-center__CzdOP style_align-center__76pto"]/a)[1]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_cHGg',
      label: 'Comments',
      path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[2]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_haaB',
      label: 'Daily Rank',
      path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[3]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_cPE7',
      label: 'Weekly Rank',
      path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[4]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_KELq',
      label: 'Description',
      path: '//div[@class="styles_htmlText__d6xln style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]/div',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ],
  Capterra: [
    {
      id: 'LABEL_G3fy',
      label: 'Product Name',
      path: '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_ECx8',
      label: 'Company Name',
      path: '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_RgKn',
      label: 'Rating',
      path: '//div[@class="nb-mr-xl"]/a/div/div[@class="nb-ml-3xs"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_i4AX',
      label: 'About',
      path: '(//div[@class="nb-px-xl md:nb-pr-xl md:nb-pl-0 md:nb-w-1/2"]/div)[1]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_C9gJ',
      label: 'Best for',
      path: '//div[@class="nb-mb-2xl "]/div/em',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_Tyb8',
      label: 'Features',
      path: '//div[@class="nb-mb-xl nb-flex nb-flex-wrap"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_qLDg',
      label: 'Pricing',
      path: '//div[@class="nb-mb-2xs"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_mKHM',
      label: 'Pricing Details',
      path: '//div[@class="nb-text-gray-400 nb-leading-md nb-tracking-md nb-text-md nb-mb-xl"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ],
  G2: [
    {
      id: 'LABEL_KTif',
      label: 'Product Name',
      path: '//a[@class="c-midnight-100"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_rzCq',
      label: 'Rating',
      path: '//div[@class="text-center ai-c star-wrapper__desc__rating"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_4FLE',
      label: 'Reviews',
      path: '//ul[@class="list--piped mb-0"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_LWKD',
      label: 'Description',
      path: '//div[@class="ws-pw"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_Xzd8',
      label: 'Languages',
      path: '(//div[@class="ml-1"])[3]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_qXr9',
      label: 'Pricing',
      path: '//div[@class="preview-cards preview-cards--responsive"]',
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    }
  ]
}
const smartcaptureconfig = [{
  "entityId": "CONFIG_123asdafds",
  "regex": "Some regex",
  "base": "LinkedIn",
  "config": [{
    "id":"LABEL_1234",
    "name": "something",
    "path": "something"
  },{
    "id":"LABEL_1234afsdfasdf",
    "name": "something asdf,lsa et safpk[sa f",
    "path": "something"
  },{
    "id":"LABEL_12342143",
    "name": "something asd fa sf89d6 324sdahjkfhhasd",
    "path": "something"
  }]
}]

export const SmartCapturePageSource: Record<string, string> = {
  LinkedIN: 'http://linkedin.com',
  Instagram: 'http://instagram.com',
  GitHub: 'http://github.com',
  Twitter: 'http://twitter.com',
  YouTube: 'http://youtube.com',
  Slack: 'http://slack.com',
  Producthunt: 'http://producthunt.com',
  Capterra: 'http://capterra.com',
  G2: 'http://g2.com'
}

export const SmartCaptureURLRegex: SmartCaptureURLRegexType = [
  {
    WebPage: 'LinkedIN',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/
  },
  {
    WebPage: 'Instagram',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\//
  },
  {
    WebPage: 'GitHub',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?github\.com\//
  },
  {
    WebPage: 'Twitter',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\//
  },
  {
    WebPage: 'YouTube',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?youtube\.com\/c\/.*\/about/
  },
  {
    WebPage: 'Slack',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?app.slack\.com\/client\/\w*\/.*\/rimeto_profile\//
  },
  {
    WebPage: 'Producthunt',
    regex: /^(http(s)?:\/\/)?([\w]+\.)producthunt\.com\/(products|posts)\//
  },
  {
    WebPage: 'Capterra',
    regex: /^(http(s)?:\/\/)?([\w]+\.)capterra\.com\/p\/[1-9]*/
  },
  {
    WebPage: 'G2',
    regex: /^(http(s)?:\/\/)?([\w]+\.)g2\.com\/products/
  }
]
