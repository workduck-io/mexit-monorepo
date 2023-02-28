import styled from 'styled-components'

export const PresenterContainer = styled.div`
  height: 50vh;

  /* z-index: 9999; */
  background-color: ${({ theme }) => theme.tokens.surfaces.app};

  border: 5px solid green;

  section.has-light-background,
  section.has-light-background h1,
  section.has-light-background h2,
  section.has-light-background h3,
  section.has-light-background h4,
  section.has-light-background h5,
  section.has-light-background h6 {
    color: ${({ theme }) => theme.tokens.text.default};
  }

  /*********************************************
 * GLOBAL STYLES
 *********************************************/
  :root {
    --r-code-font: monospace;
    --r-link-color: #42affa;
    --r-link-color-dark: #068de9;
    --r-link-color-hover: #8dcffc;
    --r-selection-background-color: #bee4fd;
    --r-selection-color: #fff;
  }

  .reveal-viewport {
    background: ${({ theme }) => theme.tokens.surfaces.modal};
    background-color: ${({ theme }) => theme.tokens.surfaces.app};
  }

  .reveal {
    font-size: 42px;
    font-weight: normal;
    color: ${({ theme }) => theme.tokens.text.default};
  }

  .reveal ::selection {
    color: var(--r-selection-color);
    background: var(--r-selection-background-color);
    text-shadow: none;
  }

  .reveal ::-moz-selection {
    color: var(--r-selection-color);
    background: var(--r-selection-background-color);
    text-shadow: none;
  }

  .reveal .slides section,
  .reveal .slides section > section {
    line-height: 1.3;
    font-weight: inherit;
  }

  /*********************************************
 * HEADERS
 *********************************************/
  .reveal h1,
  .reveal h2,
  .reveal h3,
  .reveal h4,
  .reveal h5,
  .reveal h6 {
    margin: 0 0 20px 0;
    color: ${({ theme }) => theme.tokens.text.heading};
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: normal;
    text-transform: uppercase;
    text-shadow: none;
    word-wrap: break-word;
  }

  .reveal h1 {
    font-size: 2.5em;
  }

  .reveal h2 {
    font-size: 1.6;
  }

  .reveal h3 {
    font-size: 1.3em;
  }

  .reveal h4 {
    font-size: 1em;
  }

  .reveal h1 {
    text-shadow: none;
  }

  /*********************************************
 * OTHER
 *********************************************/
  .reveal p {
    margin: 20px 0;
    line-height: 1.3;
  }

  /* Remove trailing margins after titles */
  .reveal h1:last-child,
  .reveal h2:last-child,
  .reveal h3:last-child,
  .reveal h4:last-child,
  .reveal h5:last-child,
  .reveal h6:last-child {
    margin-bottom: 0;
  }

  /* Ensure certain elements are never larger than the slide itself */
  .reveal img,
  .reveal video,
  .reveal iframe {
    max-width: 95%;
    max-height: 95%;
  }

  .reveal strong,
  .reveal b {
    font-weight: bold;
  }

  .reveal em {
    font-style: italic;
  }

  .reveal ol,
  .reveal dl,
  .reveal ul {
    display: inline-block;
    text-align: left;
    margin: 0 0 0 1em;
  }

  .reveal ol {
    list-style-type: decimal;
  }

  .reveal ul {
    list-style-type: disc;
  }

  .reveal ul ul {
    list-style-type: square;
  }

  .reveal ul ul ul {
    list-style-type: circle;
  }

  .reveal ul ul,
  .reveal ul ol,
  .reveal ol ol,
  .reveal ol ul {
    display: block;
    margin-left: 40px;
  }

  .reveal dt {
    font-weight: bold;
  }

  .reveal dd {
    margin-left: 40px;
  }

  .reveal blockquote {
    display: block;
    position: relative;
    width: 70%;
    margin: 20px auto;
    padding: 5px;
    font-style: italic;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  }

  .reveal blockquote p:first-child,
  .reveal blockquote p:last-child {
    display: inline-block;
  }

  .reveal q {
    font-style: italic;
  }

  .reveal pre {
    display: block;
    position: relative;
    width: 90%;
    margin: 20px auto;
    text-align: left;
    font-size: 0.55em;
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.2em;
    word-wrap: break-word;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  }

  .reveal code {
    font-family: 'Courier New', Courier, monospace;
    text-transform: none;
    tab-size: 2;
  }

  .reveal pre code {
    display: block;
    padding: 5px;
    overflow: auto;
    max-height: 400px;
    word-wrap: normal;
  }

  .reveal .code-wrapper {
    white-space: normal;
  }

  .reveal .code-wrapper code {
    white-space: pre;
  }

  .reveal table {
    margin: auto;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .reveal table th {
    font-weight: bold;
  }

  .reveal table th,
  .reveal table td {
    text-align: left;
    padding: 0.2em 0.5em 0.2em 0.5em;
    border-bottom: 1px solid;
  }

  .reveal table th[align='center'],
  .reveal table td[align='center'] {
    text-align: center;
  }

  .reveal table th[align='right'],
  .reveal table td[align='right'] {
    text-align: right;
  }

  .reveal table tbody tr:last-child th,
  .reveal table tbody tr:last-child td {
    border-bottom: none;
  }

  .reveal sup {
    vertical-align: super;
    font-size: smaller;
  }

  .reveal sub {
    vertical-align: sub;
    font-size: smaller;
  }

  .reveal small {
    display: inline-block;
    font-size: 0.6em;
    line-height: 1.2em;
    vertical-align: top;
  }

  .reveal small * {
    vertical-align: top;
  }

  .reveal img {
    margin: 20px 0;
  }

  /*********************************************
 * LINKS
 *********************************************/
  .reveal a {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .reveal a:hover {
    color: var(--r-link-color-hover);
    text-shadow: none;
    border: none;
  }

  .reveal .roll span:after {
    color: #fff;
    background: var(--r-link-color-dark);
  }

  /*********************************************
 * Frame helper
 *********************************************/
  .reveal .r-frame {
    border: 4px solid ${({ theme }) => theme.tokens.text.default};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  }

  .reveal a .r-frame {
    transition: all 0.15s linear;
  }

  .reveal a:hover .r-frame {
    border-color: ${({ theme }) => theme.tokens.colors.primary.default};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);

    /*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
    .reveal .controls {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }

    /*********************************************
 * PROGRESS BAR
 *********************************************/
    .reveal .progress {
      background: rgba(248, 49, 49, 0.835);
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }

    /*********************************************
 * PRINT BACKGROUND
 *********************************************/
    @media print {
      .backgrounds {
        background-color: var(--r-background-color);
      }
    }
  }
`
