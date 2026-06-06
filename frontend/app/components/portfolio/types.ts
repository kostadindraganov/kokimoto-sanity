/** Shared prop shapes for the portfolio shell + fx components. */

export type PortfolioNavItem = {
  /** Route path, e.g. "/", "/portfolio", "/blog" */
  href: string
  /** Rendered as `/label` in nav and `/label` command in the palette */
  label: string
}
