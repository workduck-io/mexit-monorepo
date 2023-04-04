export const data = [
    {
      base: 'GitHub',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?github\\.com\\/',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.083Z',
      modified: '2022-12-01T06:13:27.083Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          name: 'Username',
          path: '//span[@class="p-nickname vcard-username d-block"]',
          id: 'LABEL_Gw3e',
          properties: { type: 'p' }
        },
        {
          name: 'Bio',
          path: '//div[@class="p-note user-profile-bio mb-3 js-user-profile-bio f4"]/div',
          id: 'LABEL_UaNd',
          properties: { type: 'p' }
        },
        { name: 'Stats', path: '//div[@class="mb-3"]', id: 'LABEL_eBgk', properties: { type: 'p' } },
        { name: 'Organizations', path: '//span[@class="p-org"]', id: 'LABEL_d8P4', properties: { type: 'p' } },
        { name: 'Location', path: '//span[@class="p-label"]', id: 'LABEL_DKPG', properties: { type: 'p' } },
        { name: 'Email', path: '//li[@itemprop="email"]', id: 'LABEL_m743', properties: { type: 'p' } },
        { name: 'Website', path: '//li[@itemprop="url"]', id: 'LABEL_MYya', properties: { type: 'p' } },
        { name: 'Twitter', path: '//li[@itemprop="twitter"]', id: 'LABEL_wRJX', properties: { type: 'p' } },
        {
          name: 'Number of Repositories',
          path: '//a[@class="UnderlineNav-item js-responsive-underlinenav-item"]/span',
          id: 'LABEL_z8Fi',
          properties: { type: 'p' }
        },
        {
          name: 'Total Contributions',
          path: '//h2[@class="f4 text-normal mb-2"]',
          id: 'LABEL_NTTa',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_3m0nt5m9dydmza3gykhbp',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Capterra',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)capterra\\.com\\/p\\/[1-9]*',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.255Z',
      modified: '2022-12-01T06:13:27.255Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          name: 'Product Name',
          path: '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
          id: 'LABEL_G3fy',
          properties: { type: 'p' }
        },
        {
          name: 'Company Name',
          path: '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
          id: 'LABEL_ECx8',
          properties: { type: 'p' }
        },
        {
          name: 'Rating',
          path: '//div[@class="nb-mr-xl"]/a/div/div[@class="nb-ml-3xs"]',
          id: 'LABEL_RgKn',
          properties: { type: 'p' }
        },
        {
          name: 'About',
          path: '(//div[@class="nb-px-xl md:nb-pr-xl md:nb-pl-0 md:nb-w-1/2"]/div)[1]',
          id: 'LABEL_i4AX',
          properties: { type: 'p' }
        },
        { name: 'Best for', path: '//div[@class="nb-mb-2xl "]/div/em', id: 'LABEL_C9gJ', properties: { type: 'p' } },
        {
          name: 'Features',
          path: '//div[@class="nb-mb-xl nb-flex nb-flex-wrap"]',
          id: 'LABEL_Tyb8',
          properties: { type: 'p' }
        },
        { name: 'Pricing', path: '//div[@class="nb-mb-2xs"]', id: 'LABEL_qLDg', properties: { type: 'p' } },
        {
          name: 'Pricing Details',
          path: '//div[@class="nb-text-gray-400 nb-leading-md nb-tracking-md nb-text-md nb-mb-xl"]',
          id: 'LABEL_mKHM',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_5bews62w56w5mq28pc4in',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Producthunt',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)producthunt\\.com\\/(products|posts)\\/',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.219Z',
      modified: '2022-12-01T06:13:27.219Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          name: 'Product Name',
          path: '//h1[@class="style_mt-1__T5D6G style_color-dark-grey__aN5DV style_fontSize-32__072ip style_fontWeight-700__2tqn0"]',
          id: 'LABEL_FkdK',
          properties: { type: 'p' }
        },
        {
          name: 'Product Title',
          path: '//div[@class="style_mt-2__5s4E_ style_color-light-grey__mkoQQ style_fontSize-18__COuaE style_fontWeight-400__5p97M"]',
          id: 'LABEL_hwaJ',
          properties: { type: 'p' }
        },
        {
          name: 'No Of Reviews',
          path: '//div[@class="style_flex___KlcI style_direction-row__oinjH style_flex-row-gap-1__VY472 style_justify-center__CzdOP style_align-center__76pto"]/a[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"]',
          id: 'LABEL_j46F',
          properties: { type: 'p' }
        },
        {
          name: 'UpVotes',
          path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[1]',
          id: 'LABEL_tNgV',
          properties: { type: 'p' }
        },
        {
          name: 'UpVotes',
          path: '//button[@data-test="vote-button"]/div/div[2]',
          id: 'LABEL_tq1V',
          properties: { type: 'p' }
        },
        {
          name: 'No Of Launches',
          path: '//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob styles_link__VsvU5"]',
          id: 'LABEL_mdza',
          properties: { type: 'p' }
        },
        {
          name: 'Followers',
          path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[2]',
          id: 'LABEL_EgpT',
          properties: { type: 'p' }
        },
        {
          name: 'About',
          path: '//div[@class="style_flex___KlcI style_direction-column__w77hU style_flex-column-gap-4__87DvT style_pb-12__SqQ5M"]/div[@class="style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]',
          id: 'LABEL_iGjW',
          properties: { type: 'p' }
        },
        {
          name: 'Post Reviews',
          path: '(//div[@class="style_flex___KlcI style_direction-row__oinjH style_justify-center__CzdOP style_align-center__76pto"]/a)[1]',
          id: 'LABEL_4dqi',
          properties: { type: 'p' }
        },
        {
          name: 'Comments',
          path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[2]',
          id: 'LABEL_cHGg',
          properties: { type: 'p' }
        },
        {
          name: 'Comments',
          path: '//div[@id="about"]/div[4]/div[3]/div[2]',
          id: 'LABEL_cH3W',
          properties: { type: 'p' }
        },
        {
          name: 'Daily Rank',
          path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[3]',
          id: 'LABEL_haaB',
          properties: { type: 'p' }
        },
        {
          name: 'Weekly Rank',
          path: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[4]',
          id: 'LABEL_cPE7',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@class="styles_htmlText__d6xln style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]/div',
          id: 'LABEL_KELq',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_5eaffk61sgg6e1kxlaf75',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'G2',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)g2\\.com\\/products',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.317Z',
      modified: '2022-12-01T06:13:27.317Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        { name: 'Product Name', path: '//a[@class="c-midnight-100"]', id: 'LABEL_KTif', properties: { type: 'p' } },
        {
          name: 'Rating',
          path: '//div[@class="text-center ai-c star-wrapper__desc__rating"]',
          id: 'LABEL_rzCq',
          properties: { type: 'p' }
        },
        { name: 'Reviews', path: '//ul[@class="list--piped mb-0"]', id: 'LABEL_4FLE', properties: { type: 'p' } },
        { name: 'Description', path: '//div[@class="ws-pw"]', id: 'LABEL_LWKD', properties: { type: 'p' } },
        { name: 'Languages', path: '(//div[@class="ml-1"])[3]', id: 'LABEL_Xzd8', properties: { type: 'p' } },
        {
          name: 'Pricing',
          path: '//div[@class="preview-cards preview-cards--responsive"]',
          id: 'LABEL_qXr9',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_8c1dco7wf18wdxhyter0t',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Instagram',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?instagram\\.com\\/',
      entity: 'captureConfig',
      created: '2022-11-30T16:52:58.851Z',
      modified: '2022-11-30T16:52:58.851Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          path: '//h2[@class="_aacl _aacs _aact _aacx _aada"]',
          id: 'LABEL_cNeh',
          label: 'Name',
          properties: { type: 'p' }
        },
        { path: '//ul[@class="_aa_7"]', id: 'LABEL_UJWY', label: 'Stats', properties: { type: 'p' } },
        { path: '//div[@class="_aa_c"]', id: 'LABEL_BQe4', label: 'Bio', properties: { type: 'p' } }
      ],
      entityId: 'CONFIG_FWAYmtWBN-AhdsLXbo5r4',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Twitter',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?twitter\\.com\\/',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.122Z',
      modified: '2022-12-01T06:13:27.122Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          name: 'User Name',
          path: '//div[@class="css-901oao r-1awozwy r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-1udh08x r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
          id: 'LABEL_7Meh',
          properties: { type: 'p' }
        },
        {
          name: 'Handle',
          path: '//div[@class="css-901oao css-bfa6kz r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
          id: 'LABEL_UrNm',
          properties: { type: 'p' }
        },
        {
          name: 'Bio',
          path: '//div[@class="css-1dbjc4n"]/div[@data-testid="UserDescription"]',
          id: 'LABEL_anfd',
          properties: { type: 'p' }
        },
        {
          name: 'Join Date',
          path: '//span[@data-testid="UserJoinDate"]/span',
          id: 'LABEL_aqhf',
          properties: { type: 'p' }
        },
        {
          name: 'Following',
          path: '//div[@class="css-1dbjc4n r-1mf7evn"]/a/span',
          id: 'LABEL_BfkD',
          properties: { type: 'p' }
        },
        {
          name: 'Followers',
          path: '//div[@class="css-1dbjc4n"]/a[@class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span',
          id: 'LABEL_a44x',
          properties: { type: 'p' }
        },
        {
          name: 'Post Content',
          path: '//div[@class="css-1dbjc4n r-1s2bzr4"]/div[@data-testid="tweetText"]/span',
          id: 'LABEL_akdA',
          properties: { type: 'p' }
        },
        {
          name: 'Twitter Id',
          path: '//div[@class ="css-1dbjc4n r-18u37iz r-1wbh5a2"]',
          id: 'LABEL_akGA',
          properties: { type: 'p' }
        },
        {
          name: 'Number of Quotes',
          path: '//div[@class="css-1dbjc4n r-1mf7evn r-1yzf0co"][2]/a/div',
          id: 'LABEL_aIGA',
          properties: { type: 'p' }
        },
        {
          name: 'Number of Likes',
          path: '//div[@class="css-1dbjc4n r-1mf7evn r-1yzf0co"][3]/a/div',
          id: 'LABEL_eW3A',
          properties: { type: 'p' }
        },
        {
          name: 'Number of Retweets',
          path: '//div[@class="css-1dbjc4n r-1mf7evn r-1yzf0co"][1]/a/div',
          id: 'LABEL_eW3A',
          properties: { type: 'p' }
        },
        {
          name: 'Location',
          path: '//div[@data-testid="UserProfileHeader_Items"]/span[1]/span',
          id: 'LABEL_aneS',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_ijqznh723l7qgp83ccz23',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Slack',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?app.slack\\.com\\/client\\/\\w*\\/.*\\/rimeto_profile\\/',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.184Z',
      modified: '2022-12-01T06:13:27.184Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          name: 'Name',
          path: '//span[@class="p-r_member_profile__name__text"]',
          id: 'LABEL_LE4R',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Subtitle',
          path: '//div[@class="p-r_member_profile__subtitle"]',
          id: 'LABEL_z4Qe',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Email',
          path: '(//div[@class="p-rimeto_member_profile_field__value"])[1]',
          id: 'LABEL_ipHx',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Phone Number',
          path: '(//div[@class="p-rimeto_member_profile_field__value"])[2]',
          id: 'LABEL_pQi8',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_mz1i3ofqjczc27yksgfey',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'YouTube',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?youtube\\.com\\/c\\/.*\\/about',
      entity: 'captureConfig',
      created: '2022-12-01T06:13:27.152Z',
      modified: '2022-12-01T06:13:27.152Z',
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      labels: [
        {
          name: 'Chanel Name',
          path: '//yt-formatted-string[@class="style-scope ytd-channel-name"]',
          id: 'LABEL_NYzw',
          properties: { type: 'p' }
        },
        {
          name: 'Subscriber Count',
          path: '//yt-formatted-string[@id="subscriber-count"]',
          id: 'LABEL_YWGW',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//yt-formatted-string[@id="description"]',
          id: 'LABEL_HBjL',
          properties: { type: 'p' }
        },
        {
          name: 'Joining Date',
          path: '//div[@id="right-column"]/yt-formatted-string[@class="style-scope ytd-channel-about-metadata-renderer"]',
          id: 'LABEL_YGdt',
          properties: { type: 'p' }
        },
        {
          name: 'Total Views',
          path: '//div[@id="right-column"]/yt-formatted-string[@no-styles]',
          id: 'LABEL_6a3X',
          properties: { type: 'p' }
        }
      ],
      entityId: 'CONFIG_pmcbh4d2izrobyw1bga4m',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Linkedin',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?linkedin\\.com\\/(pub|in|profile)',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Name',
          path: '//h1[@class="text-heading-xlarge inline t-24 v-align-middle break-words"]',
          id: 'LABEL_JFAa',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Headline',
          path: '//div[@class="text-body-medium break-words"]',
          id: 'LABEL_37Xb',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Location',
          path: '//span[@class="text-body-small inline t-black--light break-words"]',
          id: 'LABEL_38CJ',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Current Company',
          path: '//div[@aria-label="Current company"]',
          id: 'LABEL_X4QV',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Education',
          path: '//div[@aria-label="Education"]',
          id: 'LABEL_eE4a',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'About',
          path: '//div[@class="display-flex ph5 pv3"]/div/div[@class="pv-shared-text-with-see-more t-14 t-normal t-black display-flex align-items-center"]/div/span[@aria-hidden="true"]',
          id: 'LABEL_Gwpz',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Conections',
          path: '//li[@class="text-body-small"]/span',
          id: 'LABEL_rPag',
          properties: { type: 'p', row: 0 }
        },
        {
          name: 'Mutual Connections',
          path: '//span[@class="t-normal t-black--light t-14 hoverable-link-text"]',
          id: 'LABEL_yXR7',
          properties: { type: 'p', row: 0 }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgthGyojAtgOVRW',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Reddit',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?reddit\\.com\\/r\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Subreddit Name',
          path: '//h2[@class="_33aRtz9JtW0dIrBNKFAl0y"]',
          id: 'LABEL_yweW',
          properties: { type: 'p' }
        },
        {
          name: 'Subreddit description',
          path: '//div[@class="_1zPvgKHteTOub9dKkvrOl4"]',
          id: 'LABEL_yQwn',
          properties: { type: 'p' }
        },
        {
          name: 'Number of members',
          path: '//div[@class="_3b9utyKN3e_kzVZ5ngPqAu"]',
          id: 'LABEL_yeNn',
          properties: { type: 'p' }
        },
        {
          name: 'Post Title',
          path: '//div[@data-test-id="post-content"]/div[3]/div/div/h1[@class="_eYtD2XCVieq6emjKBH3m"]',
          id: 'LABEL_yeNn',
          properties: { type: 'p' }
        },
        {
          name: 'Post Content',
          path: '//div[@data-test-id="post-content"]/div[5]/div',
          id: 'LABEL_yeNn',
          properties: { type: 'p' }
        },
        {
          name: 'Posted by',
          path: '//div[@data-test-id="post-content"]/div[2]/div[2]/div/div[2]',
          id: 'LABEL_yeNn',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnberoufjeSD',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'medium',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?medium\\.com\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Title',
          path: '//section/div/div[2]/div/h1',
          id: 'LABEL_WmeW',
          properties: { type: 'p' }
        },
        {
          name: 'Intro Para',
          path: '//section/div/div[2]/p[1]',
          id: 'LABEL_Wqn1',
          properties: { type: 'p' }
        },
        {
          name: 'Conclucion',
          path: '//section/div/div[2]/p[last()]',
          id: 'LABEL_W12n',
          properties: { type: 'p' }
        },
        {
          name: 'Author',
          path: '//div[@class="bk"]/a/div[@class="ab q"]',
          id: 'LABEL_W1nQ',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbrgergereSD',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Substack',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?substack\\.com\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Title',
          path: '//*[@id="post-viewer"]/div/div/div[2]/div[2]/article/div[1]/div/div[1]/div/a',
          id: 'LABEL_SneW',
          properties: { type: 'p' }
        },
        {
          name: 'Intro Para',
          path: '//div[@class="available-content"]/div/p[1]',
          id: 'LABEL_SxW7',
          properties: { type: 'p' }
        },
        {
          name: 'Conclucion',
          path: '//div[@class="available-content"]/div/p[last()]',
          id: 'LABEL_c341',
          properties: { type: 'p' }
        },
        {
          name: 'Author Name',
          path: '//a[@class="byline-profile-link"]',
          id: 'LABEL_c3sW',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbrgw^745tgvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Stackoverflow',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?stackoverflow\\.com\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Question Title',
          path: '//h1[@class="fs-headline1 ow-break-word mb8 flex--item fl1"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Question Description',
          path: '//div[@class="s-prose js-post-body"]',
          id: 'LABEL_SN20',
          properties: { type: 'p' }
        },
        {
          name: 'Top Answer',
          path: '//div[@class="answer js-answer accepted-answer js-accepted-answer"]/div/div[2]',
          id: 'LABEL_SC9R',
          properties: { type: 'p' }
        },
        {
          name: 'Question Upvote',
          path: '//div[@class="post-layout "]/div/div/div[@itemprop="upvoteCount"]',
          id: 'LABEL_Scpv',
          properties: { type: 'p' }
        },
        {
          name: 'Answer Upvote',
          path: '//div[@class="answer js-answer accepted-answer js-accepted-answer"]/div/div[1]/div/div[@itemprop="upvoteCount"]',
          id: 'LABEL_Scpv',
          properties: { type: 'p' }
        },
        {
          name: 'Tags',
          path: '//div[@class="postcell post-layout--right"]/div[2]/div/div/ul',
          id: 'LABEL_Scpv',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbrgw^745tgvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'ClickUp',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?app\\.clickup\\.com\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Title',
          path: '//textarea[@data-test="task-name-textarea"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@data-placeholder="Write something or type \'/\' for commands"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbviyv12gvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Product Board',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?[^\\.]+\\.productboard\\.com\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Title',
          path: '//textarea[@data-testid="DetailTitleTextArea-Input"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@class="sc-ndwx4n-0 jwHbkq"]/div[2]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbviyv12gvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Canny',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?[^\\.]+\\.canny\\.io\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Title',
          path: ' //div[@class="adminFeedbackPost"]/div/div/div/div[2]/div[@class="postTitle"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@class="postBody"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Upvotes',
          path: '//div[@class="postVotes"]/span',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Comments',
          path: '//div[@class="adminFeedbackPostListItem selected highlighted"]/div[@class="postInfo"]/div/div[2]/div[2]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbviyv12gvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Asana',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?app\\.asana\\.com\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Project Name',
          path: '//div[@class="TopbarPageHeaderStructureWithBreadcrumbs-titleRow"]/h1',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Issue Name',
          path: '//textarea[@aria-label="Task Name"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@id="TaskDescriptionView"]/div[1]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Assignee',
          path: '//span[@class="AssigneeToken-userNameLabel"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Labels',
          path: '//a[@class="PotTokenizerPill TaskTagTokenPills-potPill BaseLink"]/..',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Status',
          path: '//li[@class="TaskProjectToken TaskProjectToken--isEditable TaskProjects-project"]/div/span',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbviyv12gvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Jira',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?[^\\.]+\\.atlassian\\.net\\/jira\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Project Name',
          path: '//div[@data-testid="software-board.header.title.container"]/div/h1',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Issue Name',
          path: '//div[@class="_1e0c1txw _vwz4kb7n _p12f1osq _1nmz1hna _ca0qi2wt _n3tdi2wt _kqswh2mm _1ltvi2wt"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@class="css-13crxtu"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Assignee',
          path: '//div[@data-testid="issue.views.field.user.assignee"]/div/div/div/div/div/span/div/div/span',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Labels',
          path: '//div[@data-testid="issue.views.field.select.common.select-inline-edit.labels.field-inline-edit-state-less--container"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Reporter',
          path: '//div[@data-testid="issue.views.field.user.reporter"]/div/div/div/div/form/div/div/div/div/span/div/div/span',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Status',
          path: ' //div[@data-testid="ref-spotlight-target-status-spotlight"]/div/div/div/div/button/span[1]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbviyv12gvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    },
    {
      base: 'Linear',
      entity: 'captureConfig',
      regex: '^(http(s)?:\\/\\/)?([\\w]+\\.)?linear\\.app\\/',
      created: '2022-11-30T14:38:46.603Z',
      modified: '2022-11-30T14:38:46.603Z',
      labels: [
        {
          name: 'Project Name',
          path: '//span[@class="sc-pyfCe gepUKA"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Issue Name',
          path: '//textarea[@placeholder="Issue title"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Description',
          path: '//div[@placeholder="Add description…"]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Assignee',
          path: '//button[@aria-label="Assign to…"]/span[2]',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Labels',
          path: '//div[@class="sc-eFiUkU haNXGm"]/div[4]/div/button/span',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        },
        {
          name: 'Status',
          path: '//button[@aria-label="Change priority…"]/span',
          id: 'LABEL_Sw2N',
          properties: { type: 'p' }
        }
      ],
      userId: '03208652-cf07-49d2-9005-c99bd303b88b',
      entityId: 'CONFIG_uY0cRAqgtjnbviyv12gvtv',
      workspaceId: 'WORKSPACE_INTERNAL'
    }
  ]
  