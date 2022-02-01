/* eslint-disable import/prefer-default-export */
import sanitize from 'sanitize-html'

const options = {
  allowedTags: [
    'b',
    'i',
    'pre',
    'h2',
    'h3',
    'p',
    'em',
    'div',
    'table',
    'tr',
    'th',
    'td',
    'hr',
    'svg',
    'ol',
    'ul',
    'li',
    'strong',
    'a',
    'img',
    'span',
    'code',
    'thead',
    'tbody'
  ],
  enforceHtmlBoundary: true,
  allowedAttributes: {
    '*': ['style', 'href', 'target', 'rel', 'src']
  },
  transformTags: {
    hr: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          display: block;
          height: 1px;
          border: 0;
          border-top: 1px solid #ccc !important;
          color: #ccc;
          margin: 0.6rem 0;
          background-color: #ccc;
          padding: 0
          `
        }
      }
    },
    a: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          href: attribs.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: `
          color: #5b94ff;
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          text-decoration: underline;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
          outline: 0px;
        `
        }
      }
    },
    img: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          src: attribs.src,
          style: `
          ${attribs.style}
          box-sizing: border-box;
          max-width: 100%;
          border: 0px none;
          margin-left: auto;
          background-color: #f9f9f9;
          margin-right: auto;
          `
        }
      }
    },
    pre: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
            cursor: text;
            box-sizing: border-box;
            margin: 5px 0px;
            font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            padding: 5px 10px;
            counter-reset: list-1 0 list-2 0 list-3 0 list-4 0 list-5 0 list-6 0 list-7 0 list-8 0 list-9 0;
            border-radius: 3px;
            background-color: rgba(255, 255, 56, 0.3);
            white-space: pre-wrap;
            color: rgb(34,34,34);
            overflow: visible;
            font-size: 14px;
            font-style: normal;
            font-variant-ligatures: normal;
            font-variant-caps: normal;
            font-weight: 400;
            letter-spacing: normal;
            orphans: 2;
            text-align: left;
            text-transform: none;
            widows: 2;
            word-spacing: 0px;
            -webkit-text-stroke-width: 0px;
            text-decoration-style: initial;
            text-decoration-color: initial;
        `
        }
      }
    },
    ul: (tagName, attribs) => {
      // console.log(attribs.style)
      return {
        tagName,
        attribs: {
          style: `
          font-size: 14px;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          font-weight: 400;
          letter-spacing: normal;
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          `
        }
      }
    },
    ol: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          cursor: text;
          box-sizing: border-box;
          margin: 0px;
          padding-top: 0px;
          padding-right: 0px;
          padding-bottom: 0px;
          padding-left: 0.75em !important;
          counter-reset: list-1 0 list-2 0 list-3 0 list-4 0 list-5 0 list-6 0 list-7 0 list-8 0 list-9 0;
          color: rgb(170, 170, 170);
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          font-weight: 400;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    },
    li: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          box-sizing: border-box;
          counter-reset: list-1 0 list-2 0 list-3 0 list-4 0 list-5 0 list-6 0 list-7 0 list-8 0 list-9 0;
          counter-increment: list-0 1;
          padding-left: 0.75em !important;
          `
        }
      }
    },
    p: (tagName, attribs) => {
      return {
        tagName: 'p',
        attribs: {
          style: `
            cursor: text;
            box-sizing: border-box;
            margin-bottom: 5px;
            color: rgb(34, 34, 34);
            padding: 0px;
            counter-reset: list-1 0 list-2 0 list-3 0 list-4 0 list-5 0 list-6 0 list-7 0 list-8 0 list-9 0;
            font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            font-style: normal;
            font-variant-ligatures: normal;
            font-variant-caps: normal;
            font-weight: 400;
            letter-spacing: normal;
            orphans: 2;
            text-align: left;
            text-transform: none;
            white-space: pre-wrap;
            widows: 2;
            word-spacing: 0px;
            -webkit-text-stroke-width: 0px;
            text-decoration-style: initial;
            text-decoration-color: initial;
          `
        }
      }
    },
    h2: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          cursor: text;
          box-sizing: border-box;
          margin: 0px 0px 1px;
          padding: 3px 0px;
          color: rgb(34, 34, 34);
          counter-reset: list-1 0 list-2 0 list-3 0 list-4 0 list-5 0 list-6 0 list-7 0 list-8 0 list-9 0;
          font-size: 24px;
          font-weight: 700;
          line-height: 29px;
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    },
    h3: (tagName, attribs) => {
      return {
        tagName: 'h3',
        attribs: {
          style: `
          cursor: text;
          box-sizing: border-box;
          margin: 0px 0px 5px;
          padding: 3px 0px;
          counter-reset: list-1 0 list-2 0 list-3 0 list-4 0 list-5 0 list-6 0 list-7 0 list-8 0 list-9 0;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.25;
          color: rgb(34, 34, 34);
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    },
    b: (tagName, attribs) => {
      return {
        tagName: 'strong',
        attribs: {
          style: `
            box-sizing: border-box;
            border-radius: 4px;
            color: rgb(34, 34, 34);
            scroll-margin: 75px;
          `
        }
      }
    },
    em: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          box-sizing: border-box;
          border-radius: 4px;
          color: rgb(34, 34, 34);
          scroll-margin: 75px;
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: bold;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    },
    strong: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          box-sizing: border-box;
          border-radius: 4px;
          color: rgb(34, 34, 34);
          scroll-margin: 75px;
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: bold;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    },
    div: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          font-weight: 400;
          font-size: small;
          line-height: 1.58;
          color: rgb(32, 33, 36);
          font-family: arial, sans-serif;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: normal;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-thickness: initial;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    },
    span: (tagName, attribs) => {
      return {
        tagName: 'span',
        attribs: {
          style: `
          box-sizing: border-box;
          border-radius: 4px;
          color: rgb(34, 34, 34);
          scroll-margin: 75px;
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          font-weight: 400;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
      `
        }
      }
    },
    code: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          style: `
          font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          box-sizing: border-box;
          border-radius: 3px;
          color: rgb(34, 34, 34);
          scroll-margin: 75px;
          background-color: rgba(255, 255, 56, 0.3);
          font-size: 11.9px;
          padding-bottom: 2px;
          padding-top: 2px;
          font-style: normal;
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          font-weight: 400;
          letter-spacing: normal;
          orphans: 2;
          text-align: left;
          text-transform: none;
          white-space: pre-wrap;
          widows: 2;
          word-spacing: 0px;
          -webkit-text-stroke-width: 0px;
          text-decoration-style: initial;
          text-decoration-color: initial;
          `
        }
      }
    }
  }
}

export const sanitizeHtml = (html: any) => {
  return sanitize(html, options)
}
