type MetaOptions = {
  title: string
  description: string
  path?: string
  image?: string | null
  type?: string
}

const siteName = import.meta.env.VITE_SITE_TITLE || "QingMing's Blog"
const siteDescription =
  import.meta.env.VITE_SITE_DESCRIPTION || '轻茗的个人博客，记录技术、生活与长期思考。'
const configuredSiteUrl = String(import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

function getSiteUrl() {
  if (configuredSiteUrl) {
    return configuredSiteUrl
  }
  return window.location.origin
}

function resolveUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) {
    return getSiteUrl()
  }
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }
  return `${getSiteUrl()}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

function setMeta(selector: string, attribute: 'content' | 'href', value: string) {
  let element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)
  if (!element) {
    element = selector.startsWith('link')
      ? document.createElement('link')
      : document.createElement('meta')

    const nameMatch = selector.match(/name="([^"]+)"/)
    const propertyMatch = selector.match(/property="([^"]+)"/)
    const relMatch = selector.match(/rel="([^"]+)"/)

    if (nameMatch) {
      element.setAttribute('name', nameMatch[1])
    }
    if (propertyMatch) {
      element.setAttribute('property', propertyMatch[1])
    }
    if (relMatch) {
      element.setAttribute('rel', relMatch[1])
    }
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

export function useSeo({ title, description, path, image, type = 'website' }: MetaOptions) {
  const pageTitle = title === siteName ? title : `${title} | ${siteName}`
  const canonical = resolveUrl(path || window.location.pathname)
  const resolvedImage = image ? resolveUrl(image) : resolveUrl('/favicon.svg')

  document.title = pageTitle
  setMeta('meta[name="description"]', 'content', description)
  setMeta('meta[name="robots"]', 'content', 'index,follow')
  setMeta('link[rel="canonical"]', 'href', canonical)
  setMeta('meta[property="og:site_name"]', 'content', siteName)
  setMeta('meta[property="og:title"]', 'content', pageTitle)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:type"]', 'content', type)
  setMeta('meta[property="og:url"]', 'content', canonical)
  setMeta('meta[property="og:image"]', 'content', resolvedImage)
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
  setMeta('meta[name="twitter:title"]', 'content', pageTitle)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:image"]', 'content', resolvedImage)
}

export { siteDescription, siteName }
