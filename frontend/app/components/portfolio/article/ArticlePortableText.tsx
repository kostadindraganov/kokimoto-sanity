import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import {slugify} from '@/app/components/portfolio/blog/utils'
import SanityImage from '@/app/components/SanityImage'

interface ArticlePortableTextProps {
  value: PortableTextBlock[] | null | undefined
  figCaptionPrefix?: string
}

/** PortableText renderer for article bodies. Handles:
 *  - h2/h3 with slugified ids (for TOC)
 *  - blockquote as callout style
 *  - code blocks
 *  - images with fig.N captions
 *  - link annotations
 */
export function ArticlePortableText({
  value,
  figCaptionPrefix = 'fig.',
}: ArticlePortableTextProps) {
  if (!value) return null

  // Track figure numbering across the render
  let figCount = 0

  const components: PortableTextComponents = {
    types: {
      image: ({value: imgValue}: {value: {asset?: {_ref?: string}; alt?: string; caption?: string}}) => {
        if (!imgValue?.asset?._ref) return null
        figCount++
        const figNum = figCount
        return (
          <figure className="article-fig">
            <div className="article-fig-frame">
              <SanityImage
                id={imgValue.asset._ref}
                alt={imgValue.alt ?? ''}
                width={672}
                mode="cover"
                className="article-fig-img"
              />
              <div className="article-fig-scan" aria-hidden="true" />
            </div>
            {(imgValue.caption || imgValue.alt) && (
              <figcaption>
                <span className="acc">
                  {figCaptionPrefix}
                  {figNum}
                </span>{' '}
                {imgValue.caption ?? imgValue.alt}
              </figcaption>
            )}
          </figure>
        )
      },
      code: ({value: codeValue}: {value: {code?: string; language?: string; filename?: string}}) => {
        return (
          <div className="codeblock">
            <div className="ch">
              <span className="lights">
                <i />
                <i />
                <i />
              </span>
              {codeValue.filename && <span>{codeValue.filename}</span>}
              {codeValue.language && !codeValue.filename && (
                <span className="faint">{codeValue.language}</span>
              )}
            </div>
            <pre>
              <code>{codeValue.code}</code>
            </pre>
          </div>
        )
      },
    },
    block: {
      h2: ({children}) => {
        const text = extractTextFromChildren(children)
        const id = slugify(text)
        return (
          <h3 id={id}>
            <span className="hash">##</span>
            {children}
          </h3>
        )
      },
      h3: ({children}) => {
        const text = extractTextFromChildren(children)
        const id = slugify(text)
        return (
          <h4 id={id}>
            <span className="hash">###</span>
            {children}
          </h4>
        )
      },
      blockquote: ({children}) => (
        <div className="callout">
          <p>{children}</p>
        </div>
      ),
      normal: ({children}) => <p>{children}</p>,
    },
    marks: {
      link: ({children, value: link}: {children?: React.ReactNode; value?: {href?: string; openInNewTab?: boolean}}) => {
        const href = link?.href ?? '#'
        const isExternal = href.startsWith('http') || href.startsWith('//')
        return (
          <a
            href={href}
            target={isExternal || link?.openInNewTab ? '_blank' : undefined}
            rel={isExternal || link?.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      },
      strong: ({children}) => <strong>{children}</strong>,
      em: ({children}) => <em>{children}</em>,
      code: ({children}) => <code>{children}</code>,
    },
  }

  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  )
}

/** Pull plain text out of React children for use as heading id source */
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) {
    return children.map((c) => extractTextFromChildren(c)).join('')
  }
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractTextFromChildren((children as {props: {children?: React.ReactNode}}).props.children)
  }
  return ''
}
