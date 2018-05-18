import NextHead from 'next/head'
import { string } from 'prop-types'

const defaultDescription = 'Archival Repository for iOS Creatix'
const defaultOGURL = ''
const defaultOGImage = ''

const Head = (props) => (
  <NextHead>
    <meta charset="UTF-8" />
    <title>{props.title || 'Packix'}</title>
    <meta name="description" content={props.description || defaultDescription} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/icons/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/icons/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/icons/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/icons/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/icons/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/icons/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
    <link rel="icon" type="image/png" href="/icons/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="/icons/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="/icons/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="/icons/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="/icons/favicon-128.png" sizes="128x128" />
    <meta property="og:url" content={props.url || defaultOGURL} />
    <meta property="og:title" content={props.title || ''} />
    <meta property="og:description" content={props.description || defaultDescription} />
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <link rel="stylesheet" type="text/css" href="/assets/css/styles.css" />
    <link rel="stylesheet" type="text/css" href="/assets/css/fa-regular.min.css" />
    <link rel="stylesheet" type="text/css" href="/assets/css/fa-solid.min.css" />
    <link rel="stylesheet" type="text/css" href="/assets/css/fontawesome.min.css" />
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
    <script dangerouslySetInnerHTML={{__html: `
      (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-3560559626882023",
      enable_page_level_ads: true
    });`}} />

    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-118668002-1" />
    <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-118668002-1');`}}/>
  </NextHead>
)

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
}

export default Head
