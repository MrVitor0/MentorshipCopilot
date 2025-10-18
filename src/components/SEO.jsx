import { useEffect } from 'react'

export default function SEO({ 
  title = 'Mentorship CoPilot',
  description = 'AI-powered mentorship platform for finding perfect mentors and tracking progress',
  canonical = ''
}) {
  useEffect(() => {
    // Update page title
    document.title = title ? `${title} | Mentorship CoPilot` : 'Mentorship CoPilot | AI-Powered Mentorship Platform'
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | Mentorship CoPilot` : 'Mentorship CoPilot | AI-Powered Mentorship Platform')
    }
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    }
    
    // Update canonical URL if provided
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
  }, [title, description, canonical])
  
  return null
}

