import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AboutCta() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-gradient-to-br from-green-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("aboutCta.heading")}</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">{t("aboutCta.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-900 hover:bg-white/90 dark:text-blue-200 dark:hover:bg-white/80 h-12 px-6 text-base">
              {t("aboutCta.downloadButton")}
            </Button>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-green-700 hover:bg-white/90 dark:text-green-300 dark:hover:bg-white/20 h-12 px-6 text-base"
              >
                {t("aboutCta.contactButton")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
