import toast from 'react-hot-toast'

import { defaultContent, ELEMENT_PARAGRAPH } from '@mexit/core'

const data = {
  LinkedIN: {
    Name: '//h1[@class="text-heading-xlarge inline t-24 v-align-middle break-words"]',
    Headline: '//div[@class="text-body-medium break-words"]',
    Location: '//span[@class="text-body-small inline t-black--light break-words"]',
    'Current Company': '//div[@aria-label="Current company"]',
    Education: '//div[@aria-label="Education"]',
    About:
      '//div[@class="display-flex ph5 pv3"]/div/div[@class="pv-shared-text-with-see-more t-14 t-normal t-black display-flex align-items-center"]/div/span[@aria-hidden="true"]',
    Conections: '//li[@class="text-body-small"]/span',
    'Mutual Connections': '//span[@class="t-normal t-black--light t-14 hoverable-link-text"]'
    // exprience : '//div[@class="display-flex flex-row justify-space-between"]/div/div/span'
  },
  Instagram: {
    Name: '//h2[@class="_aacl _aacs _aact _aacx _aada"]',
    Stats: '//ul[@class="_aa_7"]',
    Bio: '//div[@class="_aa_c"]'
  },
  GitHub: {
    Username: '//span[@class="p-nickname vcard-username d-block"]',
    Bio: '//div[@class="p-note user-profile-bio mb-3 js-user-profile-bio f4"]/div',
    Stats: '//div[@class="mb-3"]',
    Organizations: '//span[@class="p-org"]',
    Location: '//span[@class="p-label"]',
    Email: '//li[@itemprop="email"]',
    Website: '//li[@itemprop="url"]',
    Twitter: '//li[@itemprop="twitter"]',
    'Number of Repositories': '//a[@class="UnderlineNav-item js-responsive-underlinenav-item"]/span',
    'Total Contributions': '//h2[@class="f4 text-normal mb-2"]'
  },
  Twitter: {
    'User Name':
      '//div[@class="css-901oao r-1awozwy r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-1udh08x r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
    Handle:
      '//div[@class="css-901oao css-bfa6kz r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
    Bio: '//div[@class="css-1dbjc4n"]/div[@data-testid="UserDescription"]',
    'Join Date': '//span[@data-testid="UserJoinDate"]/span',
    Following: '//div[@class="css-1dbjc4n r-1mf7evn"]/a/span',
    Followers:
      '//div[@class="css-1dbjc4n"]/a[@class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span'
  },
  YouTube: {
    'Chanel Name': '//yt-formatted-string[@class="style-scope ytd-channel-name"]',
    'Subscriber Count': '//yt-formatted-string[@id="subscriber-count"]',
    Discription: '//yt-formatted-string[@id="description"]',
    'Joining Date':
      '//div[@id="right-column"]/yt-formatted-string[@class="style-scope ytd-channel-about-metadata-renderer"]',
    'Total Views': '//div[@id="right-column"]/yt-formatted-string[@no-styles]'
  },
  Slack: {
    Name: '//span[@class="p-r_member_profile__name__text"]',
    Subtitle: '//div[@class="p-r_member_profile__subtitle"]',
    Email: '(//div[@class="p-rimeto_member_profile_field__value"])[1]',
    'Phone Number': '(//div[@class="p-rimeto_member_profile_field__value"])[2]'
  },
  Producthunt: {
    'Product Name':
      '//h1[@class="style_mt-1__T5D6G style_color-dark-grey__aN5DV style_fontSize-32__072ip style_fontWeight-700__2tqn0"]',
    'Product Title':
      '//div[@class="style_mt-2__5s4E_ style_color-light-grey__mkoQQ style_fontSize-18__COuaE style_fontWeight-400__5p97M"]',
    'No Of Reviews':
      '//div[@class="style_flex___KlcI style_direction-row__oinjH style_flex-row-gap-1__VY472 style_justify-center__CzdOP style_align-center__76pto"]/a[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"]',
    UpVotes: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[1]',
    'No Of Launches':
      '//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob styles_link__VsvU5"]',
    Followers: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[2]',
    About:
      '//div[@class="style_flex___KlcI style_direction-column__w77hU style_flex-column-gap-4__87DvT style_pb-12__SqQ5M"]/div[@class="style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]',
    //post page
    'Post Reviews':
      '(//div[@class="style_flex___KlcI style_direction-row__oinjH style_justify-center__CzdOP style_align-center__76pto"]/a)[1]',
    Comments: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[2]',
    'Daily Rank':
      '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[3]',
    'Weekly Rank':
      '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-18__COuaE style_fontWeight-600__Qmfob"])[4]',
    Discription:
      '//div[@class="styles_htmlText__d6xln style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]/div'
  },
  Capterra: {
    'Product Name': '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
    'Company Name': '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
    Rating: '//div[@class="nb-mr-xl"]/a/div/div[@class="nb-ml-3xs"]',
    About: '(//div[@class="nb-px-xl md:nb-pr-xl md:nb-pl-0 md:nb-w-1/2"]/div)[1]',
    'Best for': '//div[@class="nb-mb-2xl "]/div/em',
    Features: '//div[@class="nb-mb-xl nb-flex nb-flex-wrap"]',
    Pricing: '//div[@class="nb-mb-2xs"]',
    'Pricing Details': '//div[@class="nb-text-gray-400 nb-leading-md nb-tracking-md nb-text-md nb-mb-xl"]'
  },
  G2: {
    'Product Name': '//a[@class="c-midnight-100"]',
    Rating: '//div[@class="text-center ai-c star-wrapper__desc__rating"]',
    Reviews: '//ul[@class="list--piped mb-0"]',
    Discription: '//div[@class="ws-pw"]',
    '': '(//div[@class="ml-1"])[3]',
    Pricing: '//div[@class="preview-cards preview-cards--responsive"]'
  }
}

export const validUrl = {
  1: {
    WebPage: 'LinkedIN',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/
  },
  2: {
    WebPage: 'Instagram',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\//
  },
  3: {
    WebPage: 'GitHub',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?github\.com\//
  },
  4: {
    WebPage: 'Twitter',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\//
  },
  5: {
    WebPage: 'YouTube',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?youtube\.com\/c\/.*\/about/
  },
  6: {
    WebPage: 'Slack',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?app.slack\.com\/client\/\w*\/.*\/rimeto_profile\//
  },
  7: {
    WebPage: 'Producthunt',
    regex: /^(http(s)?:\/\/)?([\w]+\.)producthunt\.com\/(products|posts)\//
  },
  8: {
    WebPage: 'Capterra',
    regex: /^(http(s)?:\/\/)?([\w]+\.)capterra\.com\/p\/[1-9]*/
  },
  9: {
    WebPage: 'G2',
    regex: /^(http(s)?:\/\/)?([\w]+\.)g2\.com\/products/
  }
}

export const checkURL = (url) => {
  for (var key in validUrl) {
    if (url.match(validUrl[key].regex)) {
      return validUrl[key].WebPage
    }
  }
  return null
}

export const getProfileData = async (webPage: string) => {
  const sendData = []

  sendData.push({
    children: [
      {
        text: 'Profile data of webpage: ' + document.title
      },
      {
        text: ' ['
      },
      {
        type: 'a',
        url: window.location.href,
        children: [
          {
            text: 'Ref'
          }
        ]
      },
      {
        text: ' ]\n'
      }
    ]
  })

  for (var d in data[webPage]) {
    const ele = document.evaluate(data[webPage][d], document, null, XPathResult.ANY_TYPE, null).iterateNext()
    // console.log(d)
    if (ele !== null) {
      sendData.push({
        type: ELEMENT_PARAGRAPH,
        children: [
          {
            text: d + ': ' + ele.textContent.trim()
          }
        ]
      })
    } else {
      console.log('value is null')
    }
  }

  return sendData
}
