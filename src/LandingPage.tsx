import referenceHtml from "./reference-landing.html?raw"

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      onClick={(event) => {
        const target = event.target as HTMLElement
        const link = target.closest("a")
        if (link) {
          const href = link.getAttribute("href") || ""
          if (href === "#get-started") {
            event.preventDefault()
            onEnter()
          }
        }
      }}
      dangerouslySetInnerHTML={{ __html: referenceHtml }}
    />
  )
}
