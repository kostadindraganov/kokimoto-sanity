import {category} from './documents/category'
import {contactSubmission} from './documents/contactSubmission'
import {post} from './documents/post'
import {project} from './documents/project'
import {qaEntry} from './documents/qaEntry'
import {tag} from './documents/tag'
import {blockContent} from './objects/blockContent'
import {ctaCommand} from './objects/ctaCommand'
import {metric} from './objects/metric'
import {qaAction} from './objects/qaAction'
import {seo} from './objects/seo'
import {stackRow} from './objects/stackRow'
import {timelineEntry} from './objects/timelineEntry'
import {valueItem} from './objects/valueItem'
import {aboutPage} from './singletons/aboutPage'
import {blogPage} from './singletons/blogPage'
import {contactPage} from './singletons/contactPage'
import {homePage} from './singletons/homePage'
import {navigation} from './singletons/navigation'
import {portfolioPage} from './singletons/portfolioPage'
import {siteSettings} from './singletons/siteSettings'

/**
 * All schema types for the default (production) workspace.
 * https://www.sanity.io/docs/studio/schema-types
 */
export const schemaTypes = [
  // Singletons
  siteSettings,
  navigation,
  homePage,
  aboutPage,
  portfolioPage,
  blogPage,
  contactPage,
  // Documents
  project,
  post,
  category,
  tag,
  qaEntry,
  // Objects
  metric,
  timelineEntry,
  valueItem,
  stackRow,
  ctaCommand,
  qaAction,
  seo,
  blockContent,
]

/**
 * Schema for the private "inbox" workspace (dataset: inbox).
 * Contains only contact form submissions created by the frontend
 * server action.
 */
export const inboxSchemaTypes = [contactSubmission]
