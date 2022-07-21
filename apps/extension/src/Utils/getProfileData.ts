const data = {
  LinkedIN: {
    Name: '//h1[@class="text-heading-xlarge inline t-24 v-align-middle break-words"]',
    Headline: '//div[@class="text-body-medium break-words"]',
    Location: '//span[@class="text-body-small inline t-black--light break-words"]',
    'Current Company': '//div[@aria-label="Current company"]',
    Education: '//div[@aria-label="Education"]',
    About:
      '//div[@class="display-flex ph5 pv3"]/div/div[@class="pv-shared-text-with-see-more t-14 t-normal t-black display-flex align-items-center"]/div/span[@aria-hidden="true"]',
    Connections: '//li[@class="text-body-small"]/span',
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
    Location: '//li[@class="vcard-detail pt-1 css-truncate css-truncate-target hide-sm hide-md"]',
    Website: '//li[@class="vcard-detail pt-1 css-truncate css-truncate-target "]',
    Twitter: '//li[@itemprop="twitter"]',
    'Number of Repositories': '//a[@class="UnderlineNav-item js-responsive-underlinenav-item"]/span'
  },
  Twitter: {
    Name: '//div[@class="css-901oao r-1awozwy r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-1udh08x r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
    Handle:
      '//div[@class="css-901oao css-bfa6kz r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span[@class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"]',
    Description: '//div[@class="css-1dbjc4n"]/div[@data-testid="UserDescription"]',
    'Joining Date': '//span[@data-testid="UserJoinDate"]/span',
    Following: '//div[@class="css-1dbjc4n r-1mf7evn"]/a/span',
    Followers:
      '//div[@class="css-1dbjc4n"]/a[@class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"]/span'
  },
  YouTube: {
    'Channel Name': '//yt-formatted-string[@class="style-scope ytd-channel-name"]',
    'Subscriber Count': '//yt-formatted-string[@id="subscriber-count"]',
    Description: '//yt-formatted-string[@id="description"]',
    'Joining Date':
      '//div[@id="right-column"]/yt-formatted-string[@class="style-scope ytd-channel-about-metadata-renderer"]',
    'Total Views': '//div[@id="right-column"]/yt-formatted-string[@no-styles]'
  },
  Slack: {
    Name: '//span[@class="p-r_member_profile__name__text"]',
    Bio: '//div[@class="p-r_member_profile__subtitle"]',
    Email: '(//div[@class="p-rimeto_member_profile_field__value"])[1]',
    Phone: '(//div[@class="p-rimeto_member_profile_field__value"])[2]'
  },
  Producthunt: {
    productName:
      '//h1[@class="style_mt-1__T5D6G style_color-dark-grey__aN5DV style_fontSize-32__072ip style_fontWeight-700__2tqn0"]',
    productTitle:
      '//div[@class="style_mt-2__5s4E_ style_color-light-grey__mkoQQ style_fontSize-18__COuaE style_fontWeight-400__5p97M"]',
    NoOfReviews: '//a[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"]',
    upVotes: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[1]',
    NoOfLaunches:
      '//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob styles_link__VsvU5"]',
    followers: '(//div[@class="style_color-dark-grey__aN5DV style_fontSize-14___m2Wf style_fontWeight-600__Qmfob"])[2]',
    about:
      '//div[@class="style_flex___KlcI style_direction-column__w77hU style_flex-column-gap-4__87DvT style_pb-12__SqQ5M"]/div[@class="style_color-dark-grey__aN5DV style_fontSize-16__DCrgA style_fontWeight-400__5p97M"]'
  },
  Capterra: {
    productName: '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
    companyName: '//h1[@class="sm:nb-type-2xl nb-type-xl"]',
    rating: '//div[@class="nb-mr-xl"]/a/div/div[@class="nb-ml-3xs"]',
    about: '//div[@class="nb-px-xl md:nb-pr-xl md:nb-pl-0 md:nb-w-1/2"]',
    features: '//div[@class="nb-mb-xl nb-flex nb-flex-wrap"]',
    pricing: '//div[@class="nb-mb-2xs"]',
    pricingDetails: '//div[@class="nb-text-gray-400 nb-leading-md nb-tracking-md nb-text-md nb-mb-xl"]'
  },
  G2: {
    productName: '//a[@class="c-midnight-100"]',
    ratings: '//ul[@class="list--piped mb-0"]',
    description: '//div[@class="ws-pw"]',
    pricing: '//div[@class="preview-cards preview-cards--responsive"]'
  }
}

const ValidUrl = {
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
    regex: /^(http(s)?:\/\/)?([\w]+\.)?app.slack\.com\/client\/\w*\/\w*\/rimeto_profile\//
  },
  7: {
    WebPage: 'Producthunt',
    regex: /^(http(s)?:\/\/)?([\w]+\.)producthunt\.com\/products\//
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
const checkURL = (url) => {
  for (var key in ValidUrl) {
    if (url.match(ValidUrl[key].regex)) {
      return ValidUrl[key].WebPage
    }
  }
  return null
}

export const getProfileData = async () => {
  const sendData = []
  const url = window.location.href

  let webPage = await checkURL(url)
  if (webPage !== null) {
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
          children: [
            {
              text: d + ': ' + ele.textContent.trim()
            },
            {
              text: '\n'
            }
          ],
          type: 'text'
        })
      } else {
        console.log('value is null')
      }
    }
  }
  return sendData
}
